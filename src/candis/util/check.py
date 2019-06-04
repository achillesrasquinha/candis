# imports - standard imports
import collections

def check_mutable_mapping(objekt, raise_err = True):
    checked = True

    if not isinstance(objekt, collections.MutableMapping):
        if raise_err:
            raise_type_error(objekt, expected = 'dict-like object')

        checked = False

    return checked
