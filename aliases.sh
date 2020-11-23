alias docker-bash="docker exec -it bsfiles_web bash"

create-user() {
    name=$1
    pass=$2
    docker exec -it bsfiles_web python create_user.py "$name" "$pass"
}

deactivate () {
  unalias docker-bash
  unset -f create-user
}
