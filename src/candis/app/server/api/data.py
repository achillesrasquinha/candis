# imports - standard imports
import os
import json
import time
from datetime import datetime

# imports - third-party imports
from flask import request, jsonify
import addict
from requests import Timeout
import jwt

# imports - module imports
from candis.config              import CONFIG
from candis.util                import (
    assign_if_none, get_rand_uuid_str, get_timestamp_str, merge_dicts
)
from candis.app.server.app      import socketio
from candis.resource            import R
from candis.ios                 import cdata, pipeline
from candis.ios                 import json as JSON
from candis.app.server.app      import app, db
from candis.app.server.response import Response
from candis.data.entrez import API
from candis.data.GEO import API as geo_API
from candis.app.server.utils import login_required, save_response_to_db
from candis.app.server.models import Pipeline, Cdata, User
from candis.app.server.helpers.fileData import modify_data_path

FFORMATS         = JSON.read(os.path.join(R.Path.DATA, 'file-formats.json'))
ABSPATH_STARTDIR = os.path.abspath(CONFIG.App.STARTDIR)

def get_filename_if_exists(filename, count = 1, format_ = ' ({count})'):
    name, extension   = os.path.splitext(filename)

    if os.path.exists(filename):
        format_       = '{name}{format_}{extension}'.format(
            name      = name,
            format_   = format_,
            extension = extension
        )

        while os.path.exists(format_.format(count = count)):
            count += 1

        filename   = format_.format(count = count)

    return filename

def get_file_format(file_):
    format_ = None

    if file_:
        _, ext = os.path.splitext(file_)

        for metadata in FFORMATS:
            for extension in metadata['extensions']:
                if ext == extension:
                    format_ = metadata['name']

                    break

    return format_

def discover_resource(path, level = None, filter_ = None):
    tree      = addict.Dict()
    tree.path = path
    tree.dirs, tree.files = [ ], [ ]

    for file_ in os.listdir(path):
        relpath = os.path.join(path, file_)
        abspath = os.path.abspath(relpath)

        if os.path.isfile(abspath):
            if filter_:
                format_ = get_file_format(file_)

                if format_ in filter_:
                    size        = os.path.getsize(abspath)

                    wrap        = addict.Dict()
                    wrap.name   = file_
                    wrap.size   = size
                    wrap.format = format_

                    tree.files.append(wrap)

        if os.path.isdir(abspath):
            resource    = discover_resource(
                path    = relpath,
                level   = level,
                filter_ = filter_
            )

            wrap          = addict.Dict()
            wrap.resource = resource

            tree.dirs.append(wrap)

    return tree

def log_times(i):
    print("No. of times tried to connect to NCBI: {}".format(i))

@app.route(CONFIG.App.Routes.API.Data.RESOURCE, methods = ['GET', 'POST'])
@login_required
def resource(user, filter_ = ['csv', 'cel', 'model', 'arff'], level = None):
    response   = Response()

    username = user.username
    parameters = addict.Dict(request.get_json())

    data_path = os.path.join(CONFIG.App.DATADIR, modify_data_path(username))
    path       = data_path if not parameters.path else os.path.join(data_path, parameters.path)

    tree       = discover_resource(
      path     = path,
      level    = level,
      filter_  = filter_
    )

    files = tree.files
    for pipe in user.pipelines:
        temp = addict.Dict(name=pipe.name, format='pipeline')
        files.append(temp)
        for pipe_run in pipe.pipeline_run:
            if 'name' in json.loads(pipe_run.gist):
                name = json.loads(pipe_run.gist)['name']
                temp = addict.Dict(name=name, format='gist', pipeline_name=pipe.name)
                files.append(temp)
    for cdata in user.cdata:
        temp = addict.Dict(name=cdata.name, format='cdata')
        files.append(temp)
    tree.files = files

    response.set_data(tree)

    dict_      = response.to_dict()
    save_response_to_db(dict_)
    json_      = jsonify(dict_)
    code       = response.code

    return json_, code

@app.route(CONFIG.App.Routes.API.Data.READ, methods = ['GET', 'POST'])
@login_required
def read(user):
    response        = Response()

    username = user.username
    parameters      = addict.Dict(request.get_json())
    data_path = os.path.abspath(os.path.join(CONFIG.App.DATADIR, modify_data_path(username)))
    parameters.path = os.path.abspath(parameters.path) if parameters.path else data_path    

    if parameters.format == 'pipeline':
        flag = False
        for pipeline in user.pipelines:
            if parameters.name == pipeline.name:
                stages = json.loads(pipeline.stages)
                response.set_data(stages)
                flag = True
                break

        if not flag:
            response.set_error(Response.Error.NOT_FOUND, 
            'Pipeline does not exist in the database')

    if parameters.format == 'cdata':
        flag = False
        for cdat in user.cdata:
            if parameters.name == cdat.name:
                cdat_dict = json.loads(cdat.value)
                path = os.path.join(parameters.path, parameters.name)
                cdat = cdata.CData.load_from_json(cdat_dict, path)
                data = cdat.to_dict()
                response.set_data(data)
                flag = True
                break
        if not flag:
            response.set_error(Response.Error.NOT_FOUND, 
            'CData file does not exist in the database')


    if parameters.format == 'gist':
        flag = False
        for pipe in user.pipelines:
            for pipe_run in pipe.pipeline_run:
                if json.loads(pipe_run.gist)['name'] == parameters.name:
                    data = json.loads(pipe_run.gist)
                    response.set_data(data)
                    flag = True
                    break
        if not flag:
            response.set_error(Response.Error.NOT_FOUND, 
            'Gist file does not exist in the database')
        
    if parameters.name and parameters.format:
        path        = os.path.join(parameters.path, parameters.name)

        if os.path.exists(path):
            if parameters.format in ['pipeline', 'cdata', 'gist']:
                pass
            else:
                response.set_error(Response.Error.UNPROCESSABLE_ENTITY, 'Here')
        else:
            if parameters.format not in ['pipeline', 'cdata']:
                response.set_error(Response.Error.NOT_FOUND, 'File does not exist.')
    else:
        response.set_error(Response.Error.UNPROCESSABLE_ENTITY, 'There')

    dict_       = response.to_dict()
    save_response_to_db(dict_)
    json_       = jsonify(dict_)
    code        = response.code

    return json_, code

# TODO: Create a default handler that accepts JSON serializable data.
# HINT: Can be written better?
@app.route(CONFIG.App.Routes.API.Data.WRITE, methods = ['POST'])
@login_required
def write(user, output = { 'name': '', 'path': '', 'format': None }):
    response     = Response()

    username = user.username
    parameters   = addict.Dict(request.get_json())
    
    if parameters.output:
        output   = addict.Dict(merge_dicts(output, parameters.output))

    output.path = os.path.abspath(os.path.join(CONFIG.App.DATADIR, modify_data_path(username)))
    output.name  = output.name.strip() # remove padding spaces

    buffer_      = assign_if_none(parameters.buffer, [])

    opath = os.path.join(output.path, output.name)
        
    if output.format:
        if  output.format == 'cdata':
            handler = cdata

            if output.name in ['', '.cdata', '.CDATA']:
                name = get_timestamp_str('CDAT%Y%m%d%H%M%S.cdata')
            else:
                name = output.name

            output.name = name

            cdat = handler.CData()
            cdat.to_json(buffer_)
            cdata_obj = Cdata.get_cdata(name=output.name)
            
            if not cdata_obj:
                new_cdata = Cdata(name=name, user=user, value=json.dumps(buffer_))
                new_cdata.add_cdata()
                cdata_obj = new_cdata
            else:
                cdata_obj.update_cdata(value=json.dumps(buffer_))

            cdat = handler.CData.load_from_json(buffer_, opath)
            
            data = addict.Dict(output=output, data=(cdat.to_dict()))
            response.set_data(data)

        elif output.format == 'pipeline':
            handler = pipeline

            if output.name in ['', '.cpipe', '.CPIPE']:
                name = get_timestamp_str('PIPE%Y%m%d%H%M%S.cpipe')
            else:
                name = output.name

            output.name = name

            pipe = Pipeline.get_pipeline(name=output.name)

            if not pipe:
                # list is empty i.e. pipeline is just created.
                new_pipe = Pipeline(name=output.name, user=user, stages=json.dumps(buffer_))
                new_pipe.add_pipeline()
                pipe = new_pipe
            else:
                pipe.update_pipeline(last_modified=datetime.utcnow(), stages=json.dumps(buffer_))

            data = addict.Dict(output=output, data=(buffer_))
            response.set_data(data)

    dict_      = response.to_dict()
    save_response_to_db(dict_)
    json_      = jsonify(dict_)
    code       = response.code

    return json_, code

@app.route(CONFIG.App.Routes.API.Data.DELETE, methods = ['POST'])
@login_required
def delete(user):
    # delete handle to delete a pipeline
    response = Response()

    username = user.username
    parameters   = addict.Dict(request.get_json())
    opath        = os.path.join(ABSPATH_STARTDIR, parameters.name)
    
    flag = False
    for pipeline in user.pipelines:
        if parameters.name == pipeline.name:
            pipeline.delete_pipeline()
            data = addict.Dict(message="successfully deleted pipeline {}".format(parameters.name))
            response.set_data(data)
            flag = True
            break

    if not flag:
        response.set_error(Response.Error.NOT_FOUND, 'Pipeline does not exist in the database')
    
    dict_ = response.to_dict()
    save_response_to_db(dict_)
    json_ = jsonify(dict_)
    code = response.code

    return json_, code

@app.route(CONFIG.App.Routes.API.Data.SEARCH, methods = ['GET', 'POST'])
@login_required
def search(user):
    response = Response()

    parameters = addict.Dict(request.get_json())
    # TODO: type check of parameters, currently, parameters must have 'database', 'email', 'toolName'
    i = 0
    while True:
        try:
            entrez = API(parameters.email, parameters.toolName, parameters.api_key)
            break
        except Timeout:
            i += 1
    log_times(i)

    while True:
        try:
            search_results = entrez.search(parameters.database, parameters.term, usehistory='y')
            break
        except Timeout:
            i += 1
    log_times(i)
    q_key  = search_results['querykey']
    webenv = search_results['webenv']
    
    i = 0
    while True:
        try:
            summary_results = entrez.summary(parameters.database, None, WebEnv=webenv, query_key=q_key, retmax=20)
            break
        except Timeout:
            i += 1
    log_times(i)
    
    if isinstance(summary_results, list):
        # use 200 status code for 'No Content' instead of 204.
        # https://groups.google.com/d/msg/api-craft/wngl_ZKONyk/hI1n88FeUWsJ
        return jsonify(response.to_dict()), response.code
    fields = ['title', 'accession', 'taxon']
    for key in list(summary_results.keys()):
        if key == 'uids':
            del summary_results[key]
        else:
            x = [summary_results[key][i] for i in fields]
            x = dict(zip(fields, x))
            summary_results[key].clear()
            summary_results[key].update(x)

    response.set_data(summary_results)
    dict_ = response.to_dict()
    save_response_to_db(dict_)
    json_ = jsonify(dict_)
    code = response.code

    return json_, code

@app.route(CONFIG.App.Routes.API.Data.DOWNLOAD, methods = ['POST'])
@login_required
def download(user, delay=5):
    response = Response()

    username = user.username
    parameters = addict.Dict(request.get_json())
    # TODO: type check of parameters, currently, parameters must have 'database', 'email', 'toolName', 'accession', 'path'
    
    i = 0
    while True:
        try:
            entrez = API(parameters.email, parameters.toolName, parameters.api_key)
            break
        except Timeout:
            i += 1
    log_times(i)

    accession = parameters.accession
    
    i = 0
    while True:
        try:
            search_result = entrez.search(parameters.database, [accession, 'gse', 'cel'], usehistory='y', retmax=500)
            break
        except Timeout:
            i += 1
    log_times(i)

    q_key  = search_result['querykey']
    webenv = search_result['webenv']
    
    i = 0
    while True:
        try:
            results  = entrez.summary(parameters.database,None, WebEnv=webenv, query_key=q_key, retmax = 500)
            break
        except Timeout:
            i += 1
    log_times(i)

    if isinstance(results, list):
        # use 200 status code for 'No Content' instead of 204.
        # https://groups.google.com/d/msg/api-craft/wngl_ZKONyk/hI1n88FeUWsJ
        return jsonify(response.to_dict()), response.code

    links = []
    series_accession_list = []
    for key, value in results.items():
        if key != 'uids':
            links.append(value.get('ftplink'))
            series_accession_list.append(value.get('accession'))

    if os.path.split(CONFIG.App.DATADIR)[1] in os.path.split(parameters.path):
        data_path = os.path.join(CONFIG.App.DATADIR, modify_data_path(username))

        parameters.path = data_path

    geo = geo_API(path = parameters.path)
    geo.download(links[0], series_accession_list[0])
    
    while geo.status == geo.DOWNLOADING:
        status        = addict.Dict()
        status.logs   = geo.logs

        socketio.emit('status', status)

        time.sleep(delay)

    download_path = geo.fpath
    response.set_data(addict.Dict(download_path = download_path))
    
    dict_ = response.to_dict()
    save_response_to_db(dict_)
    json_ = jsonify(dict_)
    code = response.code
    
    return  json_, code
