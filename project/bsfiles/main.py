from flask import Blueprint, flash, redirect, render_template, request, url_for
from flask_login import login_required, login_user, logout_user
from werkzeug.security import generate_password_hash, check_password_hash

from . import db
from .models import User

main = Blueprint('main', __name__)


@main.route('/')
@login_required
def index():
    return render_template('index.html')

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
