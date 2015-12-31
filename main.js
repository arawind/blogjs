var express = require('express');
var config = require('./config');
var logger = require('./utils/logger');
var controllers = require('./controllers');

var PORT = 8008; // TODO: Make it configurable
var app = express();

config.configureApp(app);

var server = app.listen(PORT, function () {
    logger.info('App listening on http://%s:%s', server.address().address, server.address().port);
});

app.post('/repoPush', controllers.github.webHook);

app.get('/', controllers.article.respondAll);

app.get('/posts/:postName([a-zA-Z0-9-_]+)', controllers.article.respondOne);

