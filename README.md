A simple file upload server with authentication. Written in Python and Flask.

To upload files, one must log in. Since it is primarily intended for my personal server,
and I do not have a lot of storage space on my VPS, there is no signup page;
instead, users have to be created manually. This is to prevent random people
from signing up and uploading stuff, taking up disk space.

# Features

![Screenshot of bsfiles in action](screenshot.png)

* Upload files
* Cool 90's OS aesthetic
* **File drop:** lets you upload a single file which can then be retrieved from
  from the same page. This allows you to quickly share a file between two devices
  without having to copy over the download link.

## NGINX Config

This protects its uploads directory so that its files cannot be accessed
directly. Instead, they are accesed through `X-Accel-Redirect`, which requires
some configuration in NGINX to work:

```
server {
    ...

    # Protect the uplads directory
    location /uploads/ {
        deny all;
    }

    # make protecteUploads an alias to uploads, though only accessible through X-Accel-Redirect
    location /protectedUploads/ {
       internal;
       alias {path-to-this-repo}/uploads/;
   }

}

```

We also need to preserve the original URL when requests are proxied to the
docker container, in order for Flask to know the absolute url for download
links. To do this, add `proxy_set_header Host $host;` under `location /` in the
server block.


## TODO write about:

* Secret variables
* Creating a user
* aliases.sh
* migrations
* endpoints you can call using CURL
* SASS compiles automatically in container
* file drop
