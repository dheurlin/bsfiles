import os
from enum import Enum, auto

from flask import (Blueprint, Markup, current_app, flash, jsonify,
                   make_response, redirect, render_template, request, url_for)
from flask_login import login_required, login_user, logout_user, current_user
from werkzeug.security import check_password_hash, generate_password_hash
from werkzeug.utils import secure_filename

from . import db
from .models import User
from .utils import FileUploadError, make_unique_filename, save_file, add_dropped_file, serve_file

main = Blueprint('main', __name__)


@main.route('/')
@login_required
def index():
    return render_template('index.html')


class UploadType(Enum):
    NORMAL = auto()
    DROP   = auto()


def upload_file(upload_type: UploadType) -> str:
    file = request.files.get('file')

    filename = ''
    try: filename = save_file(file)
    except FileUploadError as e:
        return jsonify(e.message), e.code

    dl_path = url_for("main.serve_normal_file", filename=filename, _external=True)

    if upload_type == UploadType.DROP:
        print("################ Dropping...", flush=True)
        add_dropped_file(current_user, filename)

    return jsonify(dl_path)


@main.route('/upload' , methods=('POST',))
@login_required
def upload_normal():
    return upload_file(UploadType.NORMAL)


@main.route('/drop')
@login_required
def drop():
    return render_template('drop.html')


@main.route('/drop' , methods=('POST',))
@login_required
def upload_drop():
    return upload_file(UploadType.DROP)


@main.route('/files/<filename>')
def serve_normal_file(filename):
    return serve_file(filename)


@main.route('/get-dropped')
def serve_dropped_file():
    try: filename = current_user.dropped_file
    except: return "Not logged in", 400
    if not filename:
        return "User has no dropped file", 404
    return serve_file(filename)

## Login stuff #########################################################

@main.route('/login')
def login():
    return render_template('login.html')


@main.route('/login', methods=('POST',))
def login_post():
    name     = request.form.get('name')
    password = request.form.get('password')
    remember = request.form.get('remember', False)

    user = User.query.filter_by(name=name).first()
    if not user or not check_password_hash(user.password, password):
        flash('Please check your login details and try again.')
        return redirect(url_for('main.login'))

    login_user(user, remember=remember)

    return redirect(url_for('main.index'))


@main.route('/logout')
def logout():
    logout_user()
    return redirect(url_for('main.index'))


@main.route('/login-json', methods=('POST',))
def login_json():
    data = request.get_json()
    password = data.get('password')
    username = data.get('username')
    remember = data.get('remember', False)

    if not username or not password:
        return jsonify('Please provide username and password in JSON body'), 400

    user = User.query.filter_by(name=username).first()
    if not username or not check_password_hash(user.password, password):
        return jsonify('Invalid username or password'), 401

    login_user(user, remember=remember)

    return jsonify('ok')
