var config = require('../config');

module.exports = {
    respondAll: respondAll,
    respondOne: respondOne
};

function respondAll(req, res) {
    var Article = require('mongoose').model('Article');

    Article.find({}, {body: 0}, {sort: {createdAt: -1}}, function (error, articles) {
        res.render('index', {articles: articles, ganalyticsId: config.secret.ganalyticsId});
    });
}

function respondOne(req, res) {
    var postName = req.params.postName;

    postName = postName || 'Welcome';

    var Article = require('mongoose').model('Article');

    Article.findOneByCriteria({slug: postName}, function (error, art) {
        if (error) {
            return req.logger.error('Error while retrieving article', error);
        }

        if (art === null) {
            return res.sendStatus(404);
        }

        req.logger.trace('Found article', postName);

        return res.render('post', {
            title: art.title,
            body: art.body,
            tags: art.tags,
            createdAt: art.createdAt,
            updatedAt: art.updatedAt,
            ganalyticsId: config.secret.ganalyticsId
        });
    });
}
