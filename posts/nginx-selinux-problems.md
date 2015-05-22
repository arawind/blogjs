Nginx & SELinux
===============

The digitalocean box on which this blog is currently running on is a Fedora 21. I tried to configure nginx to serve static images stored on `/srv`, but got 'failed (13: Permission denied)' errors on `open()` and `stat()`. 

Googling mostly resulted in SO asking me to do chowns and chmods, which had no effect whatsoever. (Even 777! Desperation!)

One of the better solutions asked me to check whether +x is enabled on all parent directories for nginx to chdir into it - `namei -x /srv/<folders>` - but the folders already had the sufficient permissions. Another suggested doing `sudo -u nginx stat /srv/<folders>/` to check whether nginx could stat the directory as stat was failing, and again it worked without any errors.

Delving deeper (page 2 of Google ;)), there were posts which talked more about SELinux which I ignorantly dismissed thinking it was another flavor of linux. This time I paid more attention and they talked of disabling it and the comments beneath them admonished against it.

Finally [this](http://stackoverflow.com/a/29775439/4070280) gave me peace! Bless you kyl191! :D

Seriously though. There ought to be more posts on this!

For giving nginx access to `/srv`
```
$ sudo semanage fcontext -a -t httpd_sys_content_t "/srv(/.*)?"
$ sudo restorecon -R -v /srv
```
