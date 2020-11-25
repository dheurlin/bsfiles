A simple file upload client with authentication. Written in Python and Flask.

# NGINX Config

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
