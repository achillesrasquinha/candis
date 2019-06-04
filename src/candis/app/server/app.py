# imports - standard imports
import os
import sys
import logging

# imports - third-party imports
from flask          import Flask
from sqlalchemy.engine import url
from flask_migrate import Migrate
from flask_socketio import SocketIO
from htmlmin.minify import html_minify
from envparse import env, ConfigurationError
from flask_sqlalchemy import SQLAlchemy
from flask_mail import Mail
import addict

# imports - module imports
from candis.config   import CONFIG
from candis.resource import R
from candis.manager.redis.redis import Redis

log = logging.getLogger(__name__)

app      = Flask(__name__,
    template_folder = R.Path.TEMPLATES,
    static_folder   = R.Path.ASSETS
)

env.read_envfile()
# will first find from Environment variables, then from .env file if any, then will fallback to default values.
try:
    database_config = addict.Dict(
        drivername = env.str('CANDIS_DATABASE_DRIVERNAME', default='postgresql'),
        host = env.str('CANDIS_DATABASE_HOST', default='localhost'),
        port = env.str('CANDIS_DATABASE_PORT', default='5432'),
        username = env.str('CANDIS_DATABASE_USERNAME', default='postgres'),
        password = env.str('CANDIS_DATABASE_PASSWORD', default='postgres'),
        database = env.str('CANDIS_DATABASE_NAME', default='postgres')
    )
    mail_config = addict.Dict(
        MAIL_SERVER = env.str('CANDIS_MAIL_SERVER', default='smtp.gmail.com'),
        MAIL_PORT = env.str('CANDIS_MAIL_PORT', default='465'),
        MAIL_USERNAME = env.str('CANDIS_MAIL_USERNAME', default='rupavjain1@gmail.com'),
        MAIL_PASSWORD = env.str('CANDIS_MAIL_PASSWORD', default='codingninja'),
        MAIL_DEFAULT_SENDER = env.str('CANDIS_MAIL_DEFAULT_SENDER', default='rupavjain1@gmail.com'),
        MAIL_USE_SSL = env.bool('CANDIS_MAIL_USE_SSL', default=True)
    )
    app_config = addict.Dict(
        SECRET_KEY = env.str('CANDIS_SECRET_KEY', default='super_secret_key'),
        SQLALCHEMY_DATABASE_URI = str(url.URL(**database_config)),
        SQLALCHEMY_TRACK_MODIFICATIONS = env.str('CANDIS_SQLALCHEMY_TRACK_MODIFICATIONS', default='False'),
        INTEGRATE_SOCKETIO = env.str('CANDIS_INTEGRATE_SOCKETIO', default='True')
    )
except ConfigurationError as e:
    log.error("SET environment variables first: {}".format(e))
    sys.exit(1)

app.config.update(app_config)
app.config.update(mail_config)

socketio = SocketIO(app)
mail = Mail(app)
db = SQLAlchemy(app)
migrate = Migrate(app, db)

# create redis instance to store tokens which are invalid until user logins again.
redis = Redis()

@app.before_first_request
def create_tables():
    db.create_all()

@app.after_request
def minify(response):
    if response.content_type == u'text/html; charset=utf-8':
        data     = response.get_data(as_text = True)
        minified = html_minify(data)

        response.set_data(minified)

    return response
