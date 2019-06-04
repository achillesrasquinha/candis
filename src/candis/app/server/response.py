# imports - standard imports
import json

# imports - third-party imports
import addict

# imports - module imports
from candis.config import CONFIG
from candis.util   import (
    assign_if_none,
    get_rand_uuid_str
)

class Response(object):
    '''
    A Response helper object to throw on request.
    '''
    class Status(object):
        SUCCESS = 'success'
        FAILURE = 'fail'
        ERROR   = 'error'

    class Error(object):
        ACCESS_DENIED        = addict.Dict({ 'code': 401, 'message': 'Access Denied'})
        NOT_FOUND            = addict.Dict({ 'code': 404, 'message': 'Not Found' })
        UNPROCESSABLE_ENTITY = addict.Dict({ 'code': 422, 'message': 'Unprocessable Entity' })

    def __init__(self, status = None, code = 200, data = { }):
        self.version = CONFIG.VERSION
        self.id      = get_rand_uuid_str()
        self.status  = assign_if_none(status, Response.Status.SUCCESS)
        self.code    = code

        self.schema  = addict.Dict()

        self.schema.id      = get_rand_uuid_str()
        self.schema.version = self.version
        self.schema.status  = self.status

        self.set_data(data)

    def set_data(self, data):
        self.data        = data
        self.schema.data = self.data

    def set_error(self, error, messages = [ ]):
        self.status  = Response.Status.ERROR
        self.error   = error
        self.code    = self.error.code

        if  messages:
            if isinstance(messages, str):
                messages = [messages]

            self.error.errors = [ ]

            for message in messages:
                self.error.errors.append(addict.Dict({ 'message': message }))

        self.schema.status = self.status
        self.schema.error  = self.error

    def to_dict(self):
        dict_ = dict(self.schema)

        return dict_
