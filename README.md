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


## TODO write about:

* Secret variables
* Creating a user
* aliases.sh
* migrations
* endpoints you can call using CURL
