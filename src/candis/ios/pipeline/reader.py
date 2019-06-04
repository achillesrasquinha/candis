# imports - module imports
from candis.ios import json as JSON

def read(path):
    pipeline = JSON.read(path)

    return pipeline