#! /bin/bash

set -e

url="url to your instance"

# If you don't want to store these in plain text, you can omit
# either or both and you will be prompted for them if not authenticated
username=""
password=""

DIR="${HOME}/.cache/bsfiles"
mkdir -p "${DIR}"

COOKIE_FILE="$DIR/cookie"

usage() {
    echo "Usage: bsfiles.sh upload  [filename] OR"
    echo "       bsfiles.sh drop    [filename] OR"
    echo "       bsfiles.sh getdrop"
}

is_authenticated() {
    if test -f "$COOKIE_FILE"; then
        response=$(curl -s -o /dev/null -w "%{http_code}" -b "$COOKIE_FILE" "$url")
        if [ "$response" == "200" ]; then
            echo "1"
        else
            echo "0"
        fi
    else
        echo "0"
    fi
}

authenticate() {
    if [ "$username" == "" ]; then
        read -p 'Username: ' username
    fi
    if [ "$password" == "" ]; then
        read -sp 'Password: ' password
    fi

    resp=$(curl --header "Content-Type: application/json" \
              --request POST \
              --data "{\"username\":\"$username\",\"password\":\"$password\", \"remember\":true}" \
              --cookie-jar "$COOKIE_FILE" \
              --silent \
              "$url/login-json")

    if [ "$resp" != "\"ok\"" ]; then
        echo ""
        echo $resp
        echo "Exiting..."
        exit 1
    fi
}

upload() {
    curl -F "file=@$1" -b "$COOKIE_FILE" "$url/upload"
}

drop() {
    curl -F "file=@$1" -b "$COOKIE_FILE" "$url/drop"
}

getdrop() {
    curl -OJ -b "$COOKIE_FILE" "$url/get-dropped"
}

# authenticate
# upload $1
auth=$(is_authenticated)
if [ "$auth" == "0" ]; then
    echo "Not authenticated. Logging in..."
    authenticate
else
    echo "Authenticated"
fi

case $1 in
    "upload")
        upload $2
        ;;
    "drop")
        drop $2
        ;;
    "getdrop")
        getdrop
        ;;
    *)
        usage ;;
esac
