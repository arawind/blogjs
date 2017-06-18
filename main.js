const Koa = require('koa');
const router = require('koa-route');
const config = require('./config');
const logger = require('./utils/logger');
const controllers = require('./controllers');

const PORT = 8008; // TODO: Make it configurable
const app = new Koa();

config.configureApp(app);

const server = app.listen(PORT, function () {
    logger.info('App listening on http://%s:%s', server.address().address, server.address().port);
});

app.use(router.post('/repoPush', controllers.github.webHook));

app.use(router.get(['/', '/posts'], controllers.article.respondAll));

app.use(router.get('/posts/:postName([a-zA-Z0-9-_]+)', controllers.article.respondOne));

