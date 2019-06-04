# imports - standard imports
import os

# imports - module imports
from candis import util

def test_assign_if_none():
    assert util.assign_if_none(None,  'foo') == 'foo'
    assert util.assign_if_none('foo', 'bar') == 'foo'

def test_pardir():
    dirname = os.path.dirname(__file__)

    assert util.pardir(__file__)    == dirname
    assert util.pardir(__file__, 1) == dirname
    assert util.pardir(__file__, 2) == os.path.dirname(dirname)
