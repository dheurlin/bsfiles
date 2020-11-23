"""
Usage:  create_user.py username password

Creates a new user with the given username and password
"""

from bsfiles.models import User
from bsfiles import db, create_app

import sys

from werkzeug.security import generate_password_hash, check_password_hash


def create_user(username, password):
    app = create_app()
    with app.app_context():
        user = User.query.filter_by(name=username).first()
        if user is not None:
            raise ValueError(f"User {username} already exists")

        new_user = User(
            name=username,
            password=generate_password_hash(password, method='sha256'),
        )

        db.session.add(new_user)
        db.session.commit()


if __name__ == "__main__":
    create_user(sys.argv[1], sys.argv[2])
