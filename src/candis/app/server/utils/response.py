# imports - standard imports
import json

# imports - module imports
from candis.app.server.models.response import Response as ResponseModel

def save_response_to_db(dict_):
    dict_ = dict_.copy()
    if 'error' in dict_:
        dict_.update(dict(
            data = json.dumps(dict_['data']),
            error = json.dumps(dict_['error'])
        ))
    else:
        dict_.update(dict(
            data = json.dumps(dict_['data']),
            error = json.dumps({})
        ))
    resp = ResponseModel(**dict_)
    resp.add_response()
