from ..models.user import User

def validate(identity):
    # identity is expected to have an email dictionary value
    return User.find_by_email(identity["email"])
