from ..data.storage import db
from .bad_model_action import BadModelAction
from werkzeug.exceptions import NotFound, BadRequest
import sqlalchemy
from sqlalchemy import and_
from dateutil import parser

class Message(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    sender_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    recipient_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    sent = db.Column(db.DateTime(timezone=True), server_default=db.func.now(), nullable=False)
    text = db.Column(db.String, nullable=False)

    sender = db.relationship("User", backref="sent_messages", foreign_keys=[sender_id], uselist=False)
    recipient = db.relationship("User", backref="received_messages", foreign_keys=[recipient_id], uselist=False)

    def save(self):
        try:
            db.session.add(self)
            db.session.commit()
        except sqlalchemy.exc.IntegrityError:
            raise BadRequest()

    def to_json_dict(self):
        return dict(
            id=self.id,
            sender_id=self.sender_id,
            sender=self.sender.name,
            recipient_id=self.recipient_id,
            sent=self.sent.isoformat(),
            text=self.text,
        )

    @classmethod
    def from_dict(cls, data):
        required_fields = ["sender_id", "text"]
        opt_fields = ["recipient_id"]
        filtered_data = {}
        for field in required_fields:
            if field not in data:
                raise BadModelAction(f"Missing field: {field}")
            
            filtered_data[field] = data[field]

        for field in opt_fields:
            if field in data:
                filtered_data[field] = data[field]


        inst = cls(**filtered_data)

        return inst


    @classmethod
    def find_public_messages(cls, since=None, latestId=0):
        filter = [Message.recipient_id == None]

        if since:
            filter.append(Message.sent > parser.parse(since))

        if latestId:
            filter.append(Message.id > latestId)

        return cls.query.filter(and_(*filter)).order_by(cls.sent).all()
