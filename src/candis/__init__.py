# module - candis
from candis.config       import Config, get_config, CONFIG
from candis.manager      import Cache
from candis.ios.cdata    import CData
from candis.ios.pipeline import Pipeline
from candis.ios          import cdata, pipeline
from candis.data         import entrez, GEO
# candis.cli
from candis.cli          import main

cache  = Cache()
cache.create()

config = cache.get_config()
CONFIG.update(config)
