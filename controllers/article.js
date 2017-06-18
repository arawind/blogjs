const config = require('../config');
const mongoose = require('mongoose');

class ArticleController {
    constructor() {
        this.model = mongoose.model('Article');

        this.respondAll = this.respondAll.bind(this)
        this.respondOne = this.respondOne.bind(this)
    }

    async respondAll(ctx) {
        const articles = await this.model.find({}, { body: 0 }, { sort: { createdAt: -1 } });
        await ctx.render('posts', {
            articles: articles,
            ganalyticsId: config.secret.ganalyticsId
        });
    }

    async respondOne(ctx, postName) {
        const article = await this.model.findOneByCriteria({ slug: postName });

        if (!article) {
            return ctx.status = 404;
        }

        ctx.req.logger.trace('Found article', postName);

        await ctx.render('post', {
            title: article.title,
            body: article.body,
            tags: article.tags,
            createdAt: article.createdAt,
            updatedAt: article.updatedAt,
            ganalyticsId: config.secret.ganalyticsId
        });
    }
}

module.exports = ArticleController;
