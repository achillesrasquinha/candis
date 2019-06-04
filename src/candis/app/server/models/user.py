# imports - third-party imports
from werkzeug.security import generate_password_hash

# imports - module imports
from candis.app.server.app import db

class User(db.Model):
    __tablename__ = 'users'

    id_ = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(100))
    pipelines = db.relationship('Pipeline', backref='user')
    cdata = db.relationship('Cdata', backref='user')

    def __init__(self, username, email, password):
        self.username = username
        self.email = email
        self.password = self._encrypt(password)

    def add_user(self):
        try:
            db.session.add(self)
            db.session.commit()
        except Exception as e:
            db.session.rollback()
            db.session.flush()
            print(e)  # use logging
        
    def update_user(self, **kwargs):
        for key, value in kwargs.items():
            if key == 'password':
                value = self._encrypt(value)
            setattr(self, key, value)
        db.session.add(self)
        db.session.commit()

    @classmethod
    def get_user(cls, id_=None, username=None, email=None):
        if id_:
            return cls.query.filter_by(id_=id_).first()
        elif username:
            return cls.query.filter_by(username=username).first()
        elif email:
            return cls.query.filter_by(email=email).first()

    @classmethod
    def delete_user(cls, id_=None, username=None, email=None):
        user = cls.get_user(id_, username, email)
        try:
            db.session.delete(user)
            db.session.commit()
        except Exception as e:
            db.session.rollback()
            db.session.flush()
            print(e)  # use logging

    def _encrypt(self, pswd):
        return generate_password_hash(pswd)

    def close(self):
        db.session.close()

    def __repr__(self):
        return '<User {}>'.format(self.username)
