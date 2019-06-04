# imports - standard library imports
import os

# imports - third-party imports
import redis  # must have a redis-server running to use this module.

# imports - module imports
from candis.util import assign_if_none

class Redis(object):

    def __init__(self, host=None, port=None, db=False, decode_response=True):
        # TODO: to parse .env files, use python-dotenv or envparse? and for defaults use config file?
        # initialize redis client instance.
        self.redis = redis.StrictRedis(
            host = assign_if_none(host, os.getenv('CANDIS_CACHE_HOST', 'localhost')), 
            port = assign_if_none(port, os.getenv('REDIS_PORT', 6379)), 
            db = assign_if_none(db, os.getenv('REDIS_DB_INDEX', 0)), 
            decode_responses=decode_response)

    def check_redis_server(self):
        try:
            self.redis.ping()
            return True
        except redis.ConnectionError:
            return False

    def if_exists(self, key):
        return self.redis.exists(key)
