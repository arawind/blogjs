var express = require('express');
var config = require('./config');
var md2html = require('./md2html');
var githubWebHook = require('./githubWebHook');

// Models
require('./models/article');

var PORT = 8008; // TODO: Make it configurable
var app = express();

config.configureApp(app);

githubWebHook(app, config.secret['githubDeployKey']);

var server = app.listen(PORT, function () {
    console.log('App listening at http://%s:%s', server.address().address, server.address().port);
});

app.get('/', function (req, res) {
    respond('Welcome', res);
});

app.get('/posts/:postName([a-zA-Z0-9-_]+)', function (req, res) {
    var postName = req.params.postName;
    respond(postName, res);
});

function respond(postName, response) {
    postName = postName || 'Welcome';
    var Article = require('mongoose').model('Article');
    Article.updatePost('posts/' + postName + '.md');
    Article.findOneByCriteria({slug: postName}, function (error, art) {
        if (error) {
            return console.error('Error while retrieving article', error);
        }
        if (art === null) {
            return response.sendStatus(404);
        }
        console.log('Found article');
        response.send(art.body);
    });
}
