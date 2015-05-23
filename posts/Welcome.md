Welcome!
========

The blog is getting ready by the day, and I'm bent on logging everything as it's happening

Idea
----
The central idea is to keep it simple, GitHub Pages is close to it. I probably would have used it and be done with it, but the idea of doing everything from scratch enticed me and here I am building away! 

The plan is to publish the posts as markdown on GitHub which will be synced to the server on push, then converted into html and stored in MongoDB. Requests will be served content from MongoDB, along with comments if any. Comments will be plain text, sanitized probably allowing some emojis? :smile_cat:

Things that have happened till now:

1. Setup hosting
    * $5/mo basic plan on Digital Ocean
    * Fedora 21, setup the iptables to allow only http/https & ofcourse ssh!
2. Instal nginx, node and pm2
    * Node on fedora's offical repo is still running on 0.10.x, had to meddle with nvm
      to update (n, for some reason didn't work the way it used to - hence the switch to nvm)
    * pm2's systemd startup didn't work, had to use `pm2 startup centos` to get it right
    * Reverse proxied node from nginx as I didn't want to open up new ports
3. Setup the markdown to html converter
    * Used [github-markup](http://github.com/github/github-markup) in conjunction with
      [html-pipeline](https://github.com/jch/html-pipeline) along with a host of filters.
      First ever experience with ruby!
    * Modified the node application to convert this file into html
4. Use Express to serve http requests
    * Routing has been added, the posts are now accessible via /posts/<extensionless-filename>
5. Add a webhook from GitHub
    * Whenever a new push is received, GitHub sends the event details which is used 
      to pull the current branch
    * HMAC verification of the event details is done to prevent DOS attacks causing
      unnecessary pulls
    * This feature will be used to upload blog posts, not code changes
