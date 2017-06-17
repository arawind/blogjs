const config = require('../config');
const mongoose = require('mongoose');

class ArticleController {
    constructor() {
        this.model = mongoose.model('Article');

        this.respondAll = this.respondAll.bind(this)
        this.respondOne = this.respondOne.bind(this)
    }

    respondAll(req, res) {
        this.model.find({}, { body: 0 }, { sort: { createdAt: -1 } }, function (error, articles) {
            res.render('posts', {
                articles: articles,
                ganalyticsId: config.secret.ganalyticsId
            });
        });
    }

    respondOne(req, res) {
        const postName = req.params.postName || 'Welcome';

        this.model.findOneByCriteria({ slug: postName }, function (error, art) {
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
}

module.exports = ArticleController;
