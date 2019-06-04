# imports - module imports
from candis.ios.cdata import CData

def read(path, *args, **kwargs):
    cdat = CData.load(path)

    return cdat
