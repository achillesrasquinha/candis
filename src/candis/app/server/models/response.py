# imports - standard imports
from pprint import pformat
import json

# imports - third-party imports
import addict

# imports - module imports
from candis.app.server.app import db

class Response(db.Model):
    __tablename__ = 'response'

    id_ = db.Column(db.Integer, primary_key=True)
    id = db.Column(db.String, nullable=False)
    version = db.Column(db.String)
    status = db.Column(db.String(50))
    data = db.Column(db.JSON)
    error = db.Column(db.JSON)

    def add_response(self):
        try:
            db.session.add(self)
            db.session.commit()
        except Exception as e:
            db.session.rollback()
            db.session.flush()
            print(e)  # use logging

    @classmethod
    def get_response(cls, id=None, version=None, status=None):
        if id:
            return cls.query.filter_by(id=id).first()
        elif version:
            return cls.query.filter_by(version=version).first()
        elif status:
            return cls.query.filter_by(status=status).first()

    @classmethod
    def get_responses(cls, version=None, status=None):
        if version:
            return cls.query.filter_by(version=version).all()
        elif status:
            return cls.query.filter_by(status=status).all()
    
    def __repr__(self):
        resp = addict.Dict(
            id = self.id,
            version = self.version,
            status = self.status,
            data = json.loads(self.data),
            error = json.loads(self.error)
        )
        return pformat(resp)