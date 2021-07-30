from ..data.storage import db
from .bad_model_action import BadModelAction
from werkzeug.exceptions import NotFound, BadRequest
import sqlalchemy

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String)
    email = db.Column(db.String, index=True, unique=True)

    def save(self):
        try:
            db.session.add(self)
            db.session.commit()
        except sqlalchemy.exc.IntegrityError:
            raise BadRequest()

    @classmethod
    def from_dict(cls, data):
        required_fields = ["name", "email"]
        for field in required_fields:
            if field not in data:
                raise BadModelAction(f"Missing field: {field}")

        inst = cls(
            name=data["name"],
            email=data["email"],
        )

        return inst

    @classmethod
    def find_by_email(cls, email):
        user = cls.query.filter_by(email=email).one_or_none()

        if not user:
            raise NotFound()

        return user

    
    @classmethod
    def from_token(cls, data):
        return cls.from_dict(data)