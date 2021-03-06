import string
import random
import os

from flask import current_app, make_response

from . import db

def random_string(N):
    return ''.join(random.choices(string.ascii_lowercase + string.digits, k=N))

def make_unique_filename(folder: str, ext: str) -> str:
    """
    Returns a filename which is unique for the given folder
    """
    allfiles = { f for f in os.listdir(folder)
            if os.path.isfile(os.path.join(folder, f)) }

    name = ""
    ## Create random strings until we have a unique filename
    while name in allfiles or name == "":
        name = random_string(10) + ext # TODO Maybe global setting for filename length?

    return name

class FileUploadError(Exception):
    def __init__(self, message, code):
        self.message = message
        self.code    = code
        super().__init__(message)

def save_file(file) -> str:
    if file is None or file.filename == '':
        raise FileUploadError('No file provided', 400)
    try:
        ext = os.path.splitext(file.filename)[-1]
        filename = make_unique_filename(current_app.config['UPLOAD_FOLDER'], ext)
        file.save(os.path.join(current_app.config['UPLOAD_FOLDER'], filename))
        return filename
    except:
        raise FileUploadError('Failed to save file', 500)


def add_dropped_file(user, filename):
    user.dropped_file = filename
    db.session.add(user)
    db.session.commit()


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
