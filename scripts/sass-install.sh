#! /bin/sh

set -e

echo "Downloading SASS..."
curl -s https://api.github.com/repos/sass/dart-sass/releases/latest \
        | grep "browser_download_url.*-linux-x64.tar.gz" \
        | cut -d : -f 2,3 \
        | tr -d \" \
        | wget -O /tmp/sass.tar.gz -qi -

echo "Extracting SASS..."
tar xfz /tmp/sass.tar.gz -C /tmp

echo "Installing SASS..."
mv /tmp/dart-sass /usr/local/bin

echo "SASS installation complete!"
rm /tmp/sass.tar.gz

