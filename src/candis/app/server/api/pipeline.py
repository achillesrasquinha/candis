# imports - standard imports
import os
import time
import json

# imports - third-party imports
from flask import request, jsonify
import addict
import jwt

# imports - module imports
from candis.config              import CONFIG
from candis.util                import (
    assign_if_none, get_rand_uuid_str, get_timestamp_str, merge_dicts
)
from candis.resource            import R
from candis.ios                 import Pipeline, CData
from candis.ios                 import json as JSON
from candis.app.server.app      import app
from candis.app.server.app      import socketio
from candis.app.server.utils import login_required, save_response_to_db
from candis.app.server.response import Response
from candis.app.server.models import PipelineRun, Pipeline as PipelineModel, Cdata, User
from candis.app.server.helpers.fileData import modify_data_path

@app.route(CONFIG.App.Routes.API.Pipeline.PREDICT, methods = ['POST'])
@login_required
def predict(user):
    response = Response()

    username = user.username
    parameters = addict.Dict(request.get_json())

    data_path = os.path.join(CONFIG.App.DATADIR, modify_data_path(username))
    
    test_path, model_path = parameters.test_path, parameters.model_path
    if test_path and model_path:
        if(not os.path.isabs(test_path) or not os.path.isabs(model_path)):
            _, test_fname = os.path.split(test_path)
            _, model_name = os.path.split(model_path)

            test_path = os.path.abspath(os.path.join(data_path, test_fname))
            model_path = os.path.abspath(os.path.join(data_path, model_name))
        if(os.path.isfile(test_path) and os.path.isfile(model_path)):
            objkt = Pipeline()
            objkt.predict(test_path, model_path)
        else:
            response.set_error(Response.Error.NOT_FOUND)
    else:
        response.set_error(Response.Error.UNPROCESSABLE_ENTITY)

    dict_       = response.to_dict()
    save_response_to_db(dict_)
    json_       = jsonify(dict_)
    code        = response.code

    return json_, code
    
# TODO: Create a default handler that accepts JSON serializable data.
# HINT: Can be written better?
@app.route(CONFIG.App.Routes.API.Pipeline.RUN, methods = ['POST'])
@login_required
def run(user, delay = 5):
    response         = Response()

    parameters       = addict.Dict(request.get_json())
    split_percent = parameters.split_percent or 70

    stages = []
    current_pipe = None
    for p in user.pipelines:
        if p.name == parameters.name:
            current_pipe = p
            stages = json.loads(p.stages)

    if parameters.path and parameters.name and parameters.format:
        relpath      = os.path.join(parameters.path, parameters.name)

        # TODO: Check if file exists, else respond error.
        if parameters.format == 'pipeline':
            try:
                start = time.time()
                _, pipe, fpath = Pipeline.load(stages)
                
                for cdat in user.cdata:
                    if fpath.value.name == cdat.name:
                        cdat_dict = cdat.value
                        break
                
                opath =  os.path.join(fpath.value.path, fpath.value.name)
                cdat = CData.load_from_json(json.loads(cdat_dict), opath)

                pipe.run(cdat, verbose = CONFIG.DEBUG, split_percent = split_percent)

                while pipe.status == Pipeline.RUNNING:
                    status        = addict.Dict()
                    status.stages = pipe.stages
                    status.logs   = pipe.logs

                    socketio.emit('status', status)

                    time.sleep(delay)

                end = time.time()
                time_taken = end - start
                if current_pipe:
                    new_pipe_run = PipelineRun(gist=json.dumps(pipe.gist), pipeline=current_pipe, time_taken=time_taken)
                    new_pipe_run.add_pipeline_run()

                JSON.write(relpath, pipe.stages)

            except (IOError, ValueError) as e:
                response.set_error(Response.Error.UNPROCESSABLE_ENTITY, str(e))
        else:
            response.set_error(Response.Error.UNPROCESSABLE_ENTITY)
    else:
        response.set_error(Response.Error.UNPROCESSABLE_ENTITY)

    dict_       = response.to_dict()
    save_response_to_db(dict_)
    json_       = jsonify(dict_)
    code        = response.code

    return json_, code
