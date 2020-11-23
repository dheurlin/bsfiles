/scripts/wait-for-it.sh db:5432

export FLASK_APP=bsfiles
export FLASK_ENV=development
flask run --host=0.0.0.0
