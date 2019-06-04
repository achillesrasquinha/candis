# imports - standard imports
import os, errno

# imports - module imports
from candis.config import Config, CONFIG
from candis.ios    import json as JSON
from candis.util   import assign_if_none, makedirs

class Cache(object):
    '''
    A cache manager for local cache storage.
    '''
    def __init__(self, location = None, dirname = None):
        # TODO: type check - location (str, path-like object)
        # TODO: type check - dirname  (str, path-like object)
        dirhome       = os.path.expanduser('~')
        self.location = os.path.abspath(assign_if_none(location, dirhome))
        self.dirname  = assign_if_none(dirname, '.{dirname}'.format(
             dirname  = CONFIG.NAME
        ))

        self.dirpath  = os.path.join(self.location, self.dirname)

    def create(self, exists_ok = True):
        path = os.path.join(self.location, self.dirname)
        makedirs(path, exists_ok = exists_ok)

        path = os.path.join(path, 'config.json')
        para = Config()
        
        if not os.path.exists(path):
            JSON.write(path, para.schema)

    def get_config(self):
        path = os.path.join(self.location, self.dirname, 'config.json')
        para = JSON.read(path)

        return para
