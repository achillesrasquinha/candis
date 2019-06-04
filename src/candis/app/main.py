# imports - standard imports
import os

# imports - module imports
from candis.config import CONFIG
from candis.util   import get_free_port, makedirs
from candis.app    import app
from candis.app    import socketio

def main(argv = None):
	code     = os.EX_OK

	host     = CONFIG.App.HOST
	port     = get_free_port(seed = CONFIG.App.PORT)
	debug    = CONFIG.App.DEBUG
	startdir = CONFIG.App.STARTDIR

	makedirs(startdir, exists_ok = True)

	socketio.run(app, host = host, port = port, debug = debug)

	return code
