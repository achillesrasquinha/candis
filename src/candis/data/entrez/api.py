# imports - standard imports
import time
import os

# imports - third-party imports
import requests
from urllib.parse import urlencode
from redis import ResponseError

# imports - module imports
from candis.util import assign_if_none
from candis.data.entrez.const import URL
from candis.util import validate_email
from candis.config import CONFIG
from candis.manager import Redis

def sanitize_response(response, type_ = 'json'):
    if type_ == 'json':
        data  = response.json()
        try:
            kres  = data['header']['type'] + 'result'
            data = data[kres]
        except KeyError:
            kres = 'result'  # for esummary
            data = data[kres]
    else:
        # TODO: What other types can be handled? XML, HTML, etc.
        pass

    return data

def sanitize_term(term):
    if isinstance(term, list) and term:
        term = [t.replace(' ','') for t in term]
        return ' AND '.join(term)
    else:
        raise TypeError('term should be a list with atleast 1 item')

def params_dict2string(params):
    if isinstance(params, dict):
        return str(urlencode(params)).replace('%40', '@')
    else:
        raise TypeError('params should be a dictionary')


# TODO: Should we cache each response?
class API(object):
    
    def __init__(self, email, name = None, api_key = None):
        self.redis = Redis()
        if validate_email(email):
            self.email = email

        if name and not isinstance(name, str):
            raise TypeError('name should be a string')
        
        if api_key and not isinstance(api_key, str):
            raise TypeError('api_key should be a string')
        # TODO: Maybe try saving base parameters as environment variables?

        self.email      = email
        self.name       = assign_if_none(name, CONFIG.NAME)
        self.api_key    = api_key

        # TODO: Should we cache databases? - using Redis, yes!
        # checks if redis has cached 'databases'
        if self.redis.check_redis_server() and self.redis.if_exists('databases'):
            # fetch complete databases from cached memory using redis server
            try:
                self.databases = self.redis.redis.lrange('databases', 0, -1)
            except ResponseError:
                # exception caught is custom ResponseError of redis.
                # TODO: instead of raising exception, give a warning or use logging.captureWarning or log INFO
                print('redis key "databases" must be a list, refreshing cache.')
            else:
                return None
        
        self.databases  = self.info(refresh_cache = True)

    @property
    def baseparams(self):
        params = dict({ 'tool': self.name, 'email': self.email,
                        'api_key': self.api_key, 'retmode': 'json' })

        return params

    def _throttle(self):
        # checks limit for calling entrez API.
        if self.redis.if_exists('last_api_request_timestamp'):
            previous = self.redis.redis.get('last_api_request_timestamp')
            diff = time.time() - float(previous)
            if self.api_key:
                if diff <= 0.10:
                    raise requests.Timeout("Server is busy")
            else:
                if diff <= 0.33:
                    raise requests.Timeout("Server is busy")
        else:
            self.redis.redis.set('last_api_request_timestamp', time.time())
  
    def request(self, method, url, parameters = None, *args, **kwargs):
        parameters = assign_if_none(parameters, dict())
        params     = self.baseparams
        if not params['api_key']:
            del params['api_key']
        params.update(parameters)
        parameter_string = params_dict2string(params)
        
        self._throttle()
        response = requests.request(method, url, params = parameter_string, *args, **kwargs)
        self.redis.redis.set('last_api_request_timestamp', time.time())
        
        if response.ok:
            data = sanitize_response(response, params['retmode'])
        else:
            response.raise_for_status()

        return data

    def info(self, db = None, refresh_cache = False): 
        if db and not isinstance(db, str):
            raise TypeError("db should be a string")

        if not isinstance(refresh_cache, bool):
            raise TypeError("refresh_cache should be a boolean value")
     
        # Check if we haven't cached database list
        if refresh_cache:
            # GET is do-able
            data           = self.request('get', URL.INFO)
            # Clean response
            self.databases = data['dblist']
            if self.redis.check_redis_server():
                self.redis.redis.delete('databases')
                self.redis.redis.lpush('databases', *self.databases)  # cached list of databases is refreshed now

        returns = self.databases

        # Check if db is not None or not an empty string
        if db:
            if db in self.databases:
                # Passed conditions, get info
                data      = self.request('get', URL.INFO, { 'db': db })
                returns   = data['dbinfo']
            else:
                raise ValueError('database should be from : {}'.format(self.databases))

        return returns
        
    def search(self, db = 'pubmed', term = [], **optional):
        if db not in self.databases:
            raise ValueError('database should be from : {}'.format(self.databases))
        # neglect term parameter if query_key present
        if(optional.get('query_key') and optional.get('WebEnv')):
            optional.update({'db': db})
            data = self.request('get', URL.SEARCH, optional)
            return data

        term = sanitize_term(term)
        params = dict({ 'db': db, 'term': term })
        params.update(optional)
        data = self.request('get', URL.SEARCH, params)
        
        return data

    def summary(self, db = 'pubmed', id = [], **optional):   
         
        if(optional.get('query_key') and optional.get('WebEnv')):
            if db not in self.databases:
                raise ValueError('database should be from : {}'.format(self.databases))            
            # print("Using WebEnv and query_key") - TODO: Use logging instead
            optional.update({'db': db})
            data = self.request('get', URL.SUMMARY, optional)
            return data

        params = dict({ 'db': db, 'id': id})
        params.update(optional)
        data = self.request('get', URL.SUMMARY, params)
        return data
