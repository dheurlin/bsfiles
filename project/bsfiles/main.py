from flask import Blueprint, render_template
from flask_login import login_required

from . import db

main = Blueprint('main', __name__)

@main.route('/')
@login_required
def index():
    return render_template('index.html')

@main.route('/test')
def test():
    return "hello, test!"

@main.route('/login')
def login():
    return "I finna ask u to log in homie"
