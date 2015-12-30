var mongoose = require('mongoose');
var transformMd = require('../utils/md2html');
var moment = require('moment');
var logger = require('../utils/logger');

var Schema = mongoose.Schema;

var ArticleSchema = new Schema({
    title: String,
    slug: {type: String, index: true},
    body: String,
    imageUrl: String,
    layout: String,
    tags: [{type: String, index: true}],
    createdAt: {type: Date, default: Date.now, get: getDate},
    updatedAt: {type: Date, default: Date.now, get: getDate},
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

function getDate(value) {
    return moment(value).calendar();
}

function updatePost(fileName, callback) {
    logger.info('Updating post', fileName);
    transformMd(fileName, function (error, html, meta, errorData) {
        if (error) {
            logger.error('Failed to updatePosts in article model for %s', fileName, error);
            logger.error('Error Details', errorData);
            return callback(error);
        }
        createOrUpdatePost(meta, html, callback);
    });
}

function createOrUpdatePost(meta, html, callback) {
    Article.findOneByCriteria({slug: meta['slug']}, function (error, response) {
        if (error) {
            logger.error(error);
            return;
        }
        var art = response;
        if (response === null) {
            logger.info('Creating a new article');
            art = new Article();
        } else {
            logger.info('Updating existing article', art._id);
            art.updatedAt = Date.now();
        }
        for (key in meta) {
            if (meta.hasOwnProperty(key)) {
                art[key] = meta[key];
                logger.trace('Updating key %s in article with value', key, art[key]);
            }
        }
        art['body'] = html;
        art.save(function (error) {
            if (error) {
                logger.error(error);
                return callback(error);
            }
            logger.trace('Tried to update slug %s, errors? %s', meta['slug'], error !== null);
            callback(error, meta['slug']);
        });
    });
}

function findOneByCriteria(criteria, callback) {
    this.findOne(criteria)
        .exec(callback);
}
