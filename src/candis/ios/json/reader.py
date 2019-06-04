# imports - standard imports
import json

def read(path):
	with open(path, mode = 'r') as f:
		data = json.load(f)

	return data
