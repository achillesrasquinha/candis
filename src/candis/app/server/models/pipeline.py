# imports - standard imports
from datetime import datetime
import json

# imports - module imports
from candis.app.server.app import db


class Pipeline(db.Model):
    __tablename__ = 'pipeline'

    id_ = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    last_modified = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    status = db.Column(db.String(30))
    pipeline_run = db.relationship('PipelineRun', backref='pipeline')
    stages = db.Column(db.JSON)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id_'))

    def add_pipeline(self):
        try:
            db.session.add(self)
            db.session.commit()
        except Exception as e:
            db.session.rollback()
            db.session.flush()
            print(e)  # use logging

    def delete_pipeline(self):
        try:
            db.session.delete(self)
            db.session.commit()
        except Exception as e:
            db.session.rollback()
            db.session.flush()
            print(e)  # use logging
        

    def update_pipeline(self, **kwargs):
        for key, value in kwargs.items():
            setattr(self, key, value)
        db.session.add(self)
        db.session.commit()

    @classmethod
    def get_pipeline(cls, id_=None, name=None, last_modified=None):
        if id_:
            return cls.query.filter_by(id_=id_).first()
        elif name:
            return cls.query.filter_by(name=name).first()
        elif last_modified:
            return cls.query.filter_by(last_modified=last_modified).first()

    @classmethod
    def of_user(cls, user=None, pipe_name=None):
        for pipeline in user.pipelines:
            if pipeline.name == pipe_name:
                return pipeline
        return None

class PipelineRun(db.Model):
    __tablename__ = 'pipeline_run'

    id_ = db.Column(db.Integer, primary_key=True)
    gist = db.Column(db.JSON)
    last_ran_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    time_taken = db.Column(db.Numeric, nullable=False)
    pipeline_id = db.Column(db.Integer, db.ForeignKey('pipeline.id_'))
    
    def add_pipeline_run(self):
        try:
            db.session.add(self)
            db.session.commit()
        except Exception as e:
            db.session.rollback()
            db.session.flush()
            print(e)  # use logging

    @classmethod
    def of_pipeline(pipeline=None, gist_name=None):
        for pipe_run in pipeline.pipeline_run:
            if json.loads(pipe_run.gist)['name'] == gist_name:
                return pipe_run
        return None

class Cdata(db.Model):
    __tablename__ = 'cdata'

    id_ = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    value = db.Column(db.JSON)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id_'))

    def add_cdata(self):
        try:
            db.session.add(self)
            db.session.commit()
        except Exception as e:
            db.session.rollback()
            db.session.flush()
            print(e)  # TODO: use logging

    @classmethod
    def get_cdata(cls, id_=None, name=None):
        if id_:
            return cls.query.filter_by(id_=id_).first()
        elif name:
            return cls.query.filter_by(name=name).first()

    def update_cdata(self, **kwargs):
        for key, value in kwargs.items():
            setattr(self, key, value)
        db.session.add(self)
        db.session.commit()    

    @classmethod
    def of_user(user=None, cdata_name=None):
        for cdat in user.cdata:
            if cdat.name == cdata_name:
                return cdat
        return None
