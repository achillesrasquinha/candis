from werkzeug.security import check_password_hash

def verify_password(pw_hash, password):
    return check_password_hash(pw_hash, password)
