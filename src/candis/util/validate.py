import re

def validate_email(email):
    if isinstance(email, str):
        if re.match(r"^[0-9a-z-]+(\.[0-9a-z-])*@[0-9a-z-]+(\.[0-9a-z-]+)*(\.[a-z]{2,4})$", email):
            return True
        else:
            raise ValueError('Email is incorrect')
    else:
        raise TypeError('Email should be a string')
