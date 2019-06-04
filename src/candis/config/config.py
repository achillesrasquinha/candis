# imports - standard imports
import collections
import pprint

# imports - third-party imports
import yaml

# imports - module imports
from candis.util import assign_if_none
# from candis.util.check import check_mapping, check_mutable_mapping

class Config(object):
    '''
    An n-ary tree-like configuration object. Each leaf node of the tree holds a configuration value. A leaf node is denoted by an uppercase attribute
    whereas each internal node is denoted by a capitalized attribute.

    :param schema: a dict-like object for configuration data.
    :type schema: :py:obj:`dict` (default - :py:data:`{ }`)

    :Example:

    >>> import candis
    >>> config = candis.Config({ 'name': 'candis', 'version': '0.1.0' })
    >>> config.NAME
    'candis'
    '''
    def __init__(self, schema = None):
        # check_mapping(schema)
        self.schema   = assign_if_none(schema, { })

        self.children = [ ]

        self.update(self.schema)

    def update(self, schema):
        # check_mapping(schema)
        self.schema.update(dict(schema))

        for key, value in self.schema.items():
            # assuming (key, value) to be a leaf node.
            attr = key.upper()
            aval = value
            # check whether a sub-object is of type dict-like.
            # if check_mutable_mapping(value, raise_err = False):
            if isinstance(value, collections.Mapping):
                # set node name as capitalcase with corresponding value.
                attr = key if key.isupper() else key.capitalize()
                aval = Config(value)
            # check whether a sub-object is of type list-like.
            if isinstance(value, list):
                attr = key.upper()
                aval = [Config(v) if isinstance(v, collections.Mapping) else v for v in value]

            self.append(attr, aval)

    def append(self, name, value):
        child = name, value

        self.children.append(child)

        setattr(self, name, value)

    def __getattr__(self, attr):
        try:
            value = object.__getattr__(self, attr)
        except AttributeError:
            value = None

        return value

    def __repr__(self, indent = 2):
        string = pprint.pformat(self.schema, indent = indent)

        return string

    def __iter__(self):
        for child in self.children:
            yield child
