var mongoose = require('mongoose');
var transformMd = require('../md2html');

var Schema = mongoose.Schema;

var ArticleSchema = new Schema({
    title: String,
    slug: {type: String, index: true},
    body: String,
    imageUrl: String,
    layout: String,
    tags: [{type: String, index: true}],
    createdAt: {type: Date, default: Date.now},
    comments: [{
        body: String,
        user: {
            name: String,
            email: String
        },
        createdAt: {type: Date, default: Date.now}
    }]
});

ArticleSchema.statics.updatePost = updatePost;

ArticleSchema.statics.findOneByCriteria = findOneByCriteria;

var Article = mongoose.model('Article', ArticleSchema);

function updatePost(fileName) {
    transformMd(fileName, function (error, html, meta, errorData) {
        if (error) {
            console.error('Failed to updatePosts in article model', error);
            console.error('Error Details', errorData);
            return;
        }
        createOrUpdatePost(meta, html);
    });
}

function createOrUpdatePost(meta, html) {
    Article.findOneByCriteria({slug: meta['slug']}, function (error, response) {
        if (error) {
            console.error(error);
            return;
        }
        var art = response;
        if (response === null) {
            art = new Article();
        }
        for (key in meta) {
            if (meta.hasOwnProperty(key)) {
                art[key] = meta[key];
            }
        }
        art['body'] = html;
        art.save();
    });
}

function findOneByCriteria(criteria, callback) {
    this.findOne(criteria)
        .exec(callback);
}
