# Wait for postgres to be ready
/scripts/wait-for-it.sh db:5432

# Run migration scripts
flask db upgrade

# Start the Flask development server
export FLASK_ENV=development
flask run --host=0.0.0.0
