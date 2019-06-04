# imports - standard imports
import os, json, io
import time, uuid
import socket, errno
import base64

def assign_if_none(object_, value):
	if object_ is None:
		object_ = value

	return object_

def pardir(path, up = 1):
	for i in range(up):
		path = os.path.dirname(path)

	return path

def get_rand_uuid_str():
	object_ = uuid.uuid4()
	string  = str(object_)

	strip   = string.replace('-', '')

	return strip

def get_free_port(host = None, seed = 1024):
	sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

	try:
		host = assign_if_none(host, '127.0.0.1')
		port = seed

		sock.bind((host, port))

		sock.listen(1)

		sock.close()
	except socket.error as e:
		if e.errno == errno.EADDRINUSE:
			if seed == 65535:
				raise ValueError('No ports available.')
			else:
				port = get_free_port(host, seed = seed + 1)
		else:
			raise e
	finally:
		sock.close()

	return port

def makedirs(path, exists_ok = False):
	try:
		os.makedirs(path)
	except OSError as e:
		if e.errno is not errno.EEXIST and not exists_ok:
			raise

def get_timestamp_str(format_):
		string = time.strftime(format_)

		return string

def merge_dicts(*args):
		merged = dict()

		for dict_ in args:
				merged.update(dict_)

		return merged

def get_b64_plot(axes, format_ = 'png'):
	handler = io.BytesIO()
	axes.figure.savefig(handler, format = format_)
	handler.seek(0)

	buffer = handler.read()
	b64str = base64.b64encode(buffer).decode('ascii')

	handler.close()

	return b64str

def buffer_to_b64(buffer):
	buffer.seek(0)

	data   = buffer.read()
	b64str = base64.b64encode(data).decode('ascii')

	buffer.close()

	return b64str

def modify_test_path(fname, ftype = 'arff'):
    test_path = '{}.test.{}'.format(fname, ftype)
    return test_path

def modify_train_path(fname, ftype = 'arff'):
    train_path = '{}.train.{}'.format(fname, ftype)
    return train_path


