const express = require('express');
const config = require('./config');
const logger = require('./utils/logger');
const controllers = require('./controllers');

const PORT = 8008; // TODO: Make it configurable
const app = express();

config.configureApp(app);

const server = app.listen(PORT, function () {
    logger.info('App listening on http://%s:%s', server.address().address, server.address().port);
});

app.post('/repoPush', controllers.github.webHook);

app.get(['/', '/posts'], controllers.article.respondAll);

app.get('/posts/:postName([a-zA-Z0-9-_]+)', controllers.article.respondOne);

