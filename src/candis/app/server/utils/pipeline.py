# imports - standard imports
import json

# imports - module imports
from candis.app.server.models.pipeline import Pipeline, Stage

def convert_to_stage_schema(dict_):
    dict_ = dict_.copy()
    
    if 'value' in dict_:
        dict_.update(dict(
            value = json.dumps(dict_['value'])
        ))
    else:
        dict_.update(dict(
            value = json.dumps({})
        ))
    
    return dict_

def convert_to_pipeline_schema(**kwargs):
    pass
