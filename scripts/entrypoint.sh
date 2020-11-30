# Wait for postgres to be ready
/scripts/wait-for-it.sh db:5432

# Run migration scripts
flask db upgrade

# Watch SASS folder
sass --watch /project/bsfiles/static/sass:/project/bsfiles/static/css &

flask run --host=0.0.0.0
