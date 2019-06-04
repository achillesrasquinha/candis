# imports - standard imports
import os
import re

# imports - third-party imports
import yaml

# imports - module imports
from candis.resource import R

def join(loader, node):
    sequence = loader.construct_sequence(node)
    concat   = ''.join([str(i) for i in sequence])

    return concat

def relurljoin(loader, node):
    sequence = loader.construct_sequence(node)
    concat   = '/'.join([str(i) for i in sequence])
    sanitize = re.sub('/+', '/', concat)

    return sanitize

def icon(loader, node):
    scalar   = loader.constructor_scalar(node)
    path     = os.path.join(R.Path.ICON, scalar)

    return scalar
