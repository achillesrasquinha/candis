# imports - standard imports
import os

# imports - module imports
from candis.util import pardir

class R(object):
    class Path(object):
        BASE      = os.path.abspath(pardir(__file__, 2))
        RESOURCE  = os.path.join(BASE, 'resource')
        DATA      = os.path.join(RESOURCE, 'data')

        APP       = os.path.join(BASE, 'app')

        ASSETS    = os.path.join(APP, 'assets')
        TEMPLATES = os.path.join(APP, 'templates')
