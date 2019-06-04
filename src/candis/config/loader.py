# imports - standard imports
import os

# imports - third-party imports
import yaml

# imports - module imports
from candis.resource import R
from candis.config   import constructor
from candis.config   import Config

class Loader(object):
    DEFAULT_CONFIG       = os.path.join(R.Path.DATA, 'config.yml')
    DEFAULT_CONSTRUCTORS = [
        ('!join',       constructor.join),
        ('!relurljoin', constructor.relurljoin),
        ('!icon',       constructor.icon),
    ]
    '''
    Loads and parses a YAML configuration file into a :py:obj:`candis.Config` object.

    :Example:

    >>> import candis as cd
    >>> loader = cd.config.Loader()
    >>> config = loader.load()
    '''
    def __init__(self):
        self.constructors = Loader.DEFAULT_CONSTRUCTORS

        for name, constructor in self.constructors:
            self.register_constructor(name, constructor)

    def register_constructor(self, name, constructor):
        yaml.add_constructor(name, constructor)

    def load(self, filename = None):
        data     = dict()

        with open(Loader.DEFAULT_CONFIG) as f:
            data = yaml.load(f, Loader = yaml.FullLoader)

        config   = Config(data)

        if filename and os.path.isfile(filename):
            with open(filename) as f:
                data = yaml.load(f, Loader = yaml.FullLoader)

                config.update(data)

        return config
