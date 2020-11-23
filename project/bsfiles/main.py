import os

from flask import Blueprint, flash, redirect, render_template, request, url_for, current_app
from flask_login import login_required, login_user, logout_user
from werkzeug.security import check_password_hash, generate_password_hash
from werkzeug.utils import secure_filename

from . import db
from .models import User

main = Blueprint('main', __name__)

@main.route('/')
@login_required
def index():
    return render_template('index.html')

@main.route('/', methods=('POST',))
@login_required
def upload_file():
    # check if the post request has the file part
    file = request.files.get('file')
    if file is None or file.filename == '':
        flash('No file part')
        return redirect(url_for('main.index'))

    filename = secure_filename(file.filename)
    file.save(os.path.join(current_app.config['UPLOAD_FOLDER'], filename))

    flash('File uploaded successfully')
    return redirect(url_for('main.index'))


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
