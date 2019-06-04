import hashlib

def modify_data_path(username):
    hash_val = hashlib.sha256(username.encode()).hexdigest()
    return '{}_data'.format(hash_val)
