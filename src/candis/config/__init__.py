# module - candis.config
from candis.config.config import Config
from candis.config.loader import Loader

def get_config(filename = None):
    loader = Loader()
    config = loader.load(filename)

    return config

CONFIG     = get_config()
