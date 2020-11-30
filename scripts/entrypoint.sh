# Wait for postgres to be ready
/scripts/wait-for-it.sh db:5432

# Run migration scripts
flask db upgrade

# Watch SASS folder
sass --watch /project/bsfiles/static/sass:/project/bsfiles/static/css &

# Launch the server
if [[ $FLASK_ENV == "development" ]]; then
  flask run --host=0.0.0.0
elif [[ $FLASK_ENV == "production" ]]; then
  uwsgi -s /socket/app.sock --manage-script-name --mount /=bsfiles.wsgi:app --chmod-socket=666
fi

