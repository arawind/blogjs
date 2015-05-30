var express = require('express');
var moment = require('moment');
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
    respondAll(res, 'index');
});

app.get('/posts/:postName([a-zA-Z0-9-_]+)', function (req, res) {
    var postName = req.params.postName;
    respondOne(postName, res, 'post');
});

function respondAll(response, template) {
    var Article = require('mongoose').model('Article');
    Article.find({}, {body: 0}, {sort: {createdAt: -1}}, function (error, articles) {
        response.render(template, {articles: articles});
    });
}

function respondOne(postName, response, template) {
    postName = postName || 'Welcome';
    var Article = require('mongoose').model('Article');
    Article.findOneByCriteria({slug: postName}, function (error, art) {
        if (error) {
            return console.error('Error while retrieving article', error);
        }
        if (art === null) {
            return response.sendStatus(404);
        }
        console.log('Found article', postName);
        var createdAt = moment(art.createdAt).calendar();
        var updatedAt = moment(art.updatedAt).calendar();
        response.render(template, {
            title: art.title, 
            body: art.body,
            tags: art.tags,
            createdAt: createdAt,
            updatedAt: updatedAt
        });
    });
}
