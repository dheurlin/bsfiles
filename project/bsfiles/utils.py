import string
import random
import os

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
