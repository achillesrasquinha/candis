# imports - third-party imports
from flask import render_template

# imports - module imports
from candis.app.server import app
from candis.config import CONFIG

# Catch-All URL - http://flask.pocoo.org/snippets/57/
@app.route(CONFIG.App.Routes.BASE, defaults = { 'path': '' })
@app.route(CONFIG.App.Routes.BASE + '<path:path>')
def index(path, page = { }):
    template = render_template('pages/index.html', config = CONFIG.App, page = page)

    return template
