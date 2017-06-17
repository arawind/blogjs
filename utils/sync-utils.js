module.exports = {
    syncStatic,
    gitPull,
    checkDiff,
    parseAndUpdate
};

const exec = require('child_process').exec;
const fd = require('./fileDeferrer');
const logger = require('./logger');

function syncStatic(callback) {
    callback = callback || function () {};
    logger.info('Syncing static files');
    exec('rsync -av --delete ./static/ /srv/static/blogjs/', callback);
}

function gitPull(ref, callback) {
    callback = callback || function () {};
    logger.info('Pulling ref: ', ref);
    exec('git pull', callback);
}

function checkDiff(between, callback) {
    between = between || '';
    callback = callback || function () {};
    logger.info('Getting diff ', between);
    exec('git diff --name-only ' + between, callback);
}

function parseAndUpdate(error, stdout, stderr, callback) {
    if (error) {
        logger.error('Error while parsing output of git diff', error);
        return;
    }
    callback = callback || function () {
        logger.info('All files have been updated');
    };
    const files = stdout.split('\n'); 
    const Article = require('mongoose').model('Article');
    for (let i = 0; i < files.length; i++) {
        if (/^posts\/[\w-_]+\.md$/.test(files[i])) {
            // This test is important, as md2html assumes all files match
            //  /xxxxxx.md$ format
            logger.trace('Parsing ', files[i]);
            fd.deferUpdate(files[i], function (fileName) {
                Article.updatePost(fileName, function (error, slug) {
                    if (error) {
                        logger.error('githubWebHook - Tried to work with the %s post, failed', slug, error);
                        return;
                    }
                    logger.trace('Slug %s has been updated', slug);
                    fd.queueNext(function () {
                        callback();
                    });
                });
            });
        }
    }
    fd.queueNext(function () {
        callback();
    });
}
