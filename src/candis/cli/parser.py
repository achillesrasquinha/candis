# imports - standard imports
import argparse

class ArgumentParser(argparse.ArgumentParser):
    def __init__(self, config, *args, **kwargs):
        self.super  = super(ArgumentParser, self)
        self.config = config

        self.super.__init__(*args, **kwargs)
        
        for argument in self.config.ARGUMENTS:
          self.add_argument(*argument.NAME,
            help    = argument.HELP)

    def parse(self, argv = None):
        args        = self.parse_args(argv)

        return args
