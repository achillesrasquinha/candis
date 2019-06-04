# imports - standard imports
import json

def write(path, buffer_, indent = 4):
		with open(path, mode = 'w') as f:
			json.dump(buffer_, f, indent = 4)