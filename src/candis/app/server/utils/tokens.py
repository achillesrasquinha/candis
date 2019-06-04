# imports - standard imports
from functools import wraps

# imports - third-party imports
from flask import request
from flask import jsonify
import jwt

# imports - module imports
from candis.app.server.app import app, redis
from candis.app.server.response import Response
from candis.app.server.models import User

def login_required(f):
    @wraps(f)
    def wrap(*args, **kwargs):
        try:
            payload = jwt.decode(request.headers.get('token'), app.config['SECRET_KEY'])
            if redis.redis.hget('blacklist', payload['username']) == "True":
                response = Response()
                response.set_error(
                    Response.Error.ACCESS_DENIED,
                    "Session timed out. Login again."
                )
                
                dict_      = response.to_dict()
                json_      = jsonify(dict_)
                code       = response.code
                
                return json_, code

            decoded_token = jwt.decode(request.headers.get('token'), app.config['SECRET_KEY'])
            username = decoded_token['username']
            user = User.get_user(username=username)

            return f(user=user, *args, **kwargs)
        except Exception as e:
            print(e)  # TODO: use logger
            response = Response()
            response.set_error(
                Response.Error.ACCESS_DENIED,
                "Please log in first."
            )
            dict_      = response.to_dict()
            json_      = jsonify(dict_)
            code       = response.code    
            return json_, code
    return wrap

def logout_required(f):
    @wraps(f)
    def wrap(*args, **kwargs):
        try:
            payload = jwt.decode(request.headers.get('token'), app.config['SECRET_KEY'])
            if redis.redis.hget('blacklist', payload['username']) == "False":
                
                response = Response()
                response.set_error(
                    Response.Error.ACCESS_DENIED,
                    "Already logged in"
                )
                dict_      = response.to_dict()
                json_      = jsonify(dict_)
                code       = response.code    
                
                return json_, code
            return f(*args, **kwargs)
        except Exception as e:
            return f(*args, **kwargs)
    return wrap

    