alias docker-bash="docker exec -it bsfiles_web bash"

create-user() {
    name=$1
    pass=$2
    docker exec -it bsfiles_web python create_user.py "$name" "$pass"
}

flask-migrate() {
    msg=$1
    docker exec -it bsfiles_web flask db migrate -m "$msg"
}

deactivate () {
  unalias docker-bash
  unset -f create-user
  unset -f flask-migrate
}
