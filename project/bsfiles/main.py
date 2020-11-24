import os

from flask import (Blueprint, current_app, flash, redirect, render_template,
                   request, url_for, make_response, Markup)
from flask_login import login_required, login_user, logout_user
from werkzeug.security import check_password_hash, generate_password_hash
from werkzeug.utils import secure_filename

from . import db
from .models import User
from .utils import make_unique_filename, save_file, FileUploadError

main = Blueprint('main', __name__)


@main.route('/')
@login_required
def index():
    return render_template('index.html')


@main.route('/', methods=('POST',))
@login_required
def upload_file():
    file = request.files.get('file')

    filename = ''
    try: filename = save_file(file)
    except FileUploadError as e:
        return e.message, e.code

    dl_path = url_for("main.serve_file", filename=filename, _external=True)
    return dl_path

@main.route('/files/<filename>')
def serve_file(filename):
    fullpath = os.path.join(current_app.config['UPLOAD_FOLDER'], filename)
    if not os.path.isfile(fullpath):
        return "File not found!", 404

    response = make_response()
    response.headers['Content-Type'] = ''
    response.headers['Content-Disposition'] = f'attachment; filename={filename}'
    response.headers['X-Accel-Redirect'] = os.path.join(
            current_app.config['PROTECTED_UPLOAD_FOLDER'], filename)

    return response

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
