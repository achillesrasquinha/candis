# imports - standard imports
import os

# imports - module imports
from candis.util       import assign_if_none
from candis.cli.parser import ArgumentParser
from candis.config     import CONFIG
from candis.ios        import Pipeline
from candis            import app

def main(argv = None):
    '''
    A starting execution point for :py:mod:`candis`

    :param argv: (optional) a list of valid arguments
    :type argv: :py:obj:`list(str)` or :py:data:`None` (default)
    :returns: A valid exit code. Check out `Python Documentation <https://docs.python.org/2/library/os.html#os.EX_OK>`_ for a list of various exit codes.
    :rtype: int

    :Example:

    >>> import candis
    >>> candis.main() # Launch the Rich Internet Application (RIA)
    '''
    code   = os.EX_OK
    
    parser = ArgumentParser(CONFIG.CLI)
    args   = parser.parse(argv)

    if not argv:
        code = app.main()
    else:
        if args.cdata:
            pipe = Pipeline()
            path = args.cdata

            pipe.run(path)

    return code
