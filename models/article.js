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
    updatedAt: {type: Date, default: Date.now},
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

function updatePost(fileName, callback) {
    console.log('Updating post', fileName);
    transformMd(fileName, function (error, html, meta, errorData) {
        if (error) {
            console.error('Failed to updatePosts in article model', error);
            console.error('Error Details', errorData);
            return callback(error);
        }
        createOrUpdatePost(meta, html, callback);
    });
}

function createOrUpdatePost(meta, html, callback) {
    Article.findOneByCriteria({slug: meta['slug']}, function (error, response) {
        if (error) {
            console.error(error);
            return;
        }
        var art = response;
        if (response === null) {
            console.log('Creating a new article');
            art = new Article();
        } else {
            console.log('Updating existing article', art._id);
            art.updatedAt = Date.now();
        }
        for (key in meta) {
            if (meta.hasOwnProperty(key)) {
                art[key] = meta[key];
                console.log('Updating key %s in article with value', key, art[key]);
            }
        }
        art['body'] = html;
        art.save(function (error) {
            if (error) {
                console.error(error);
                return callback(error);
            }
            console.log('Tried to update slug %s, errors? %s', meta['slug'], error !== null);
            callback(error, meta['slug']);
        });
    });
}

function findOneByCriteria(criteria, callback) {
    this.findOne(criteria)
        .exec(callback);
}
