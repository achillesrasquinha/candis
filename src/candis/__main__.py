# imports - standard imports
import sys

# imports - module imports
import candis

if __name__ == '__main__':
    args = sys.argv[1:]
    code = candis.main(args)

    sys.exit(code)