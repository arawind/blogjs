# For mac, when mongod isn't installed as a service but was installed via brew

mongod --config /usr/local/etc/mongod.conf  --fork --logpath /var/log/mongod.log && node_modules/nodemon/bin/nodemon.js main.js
