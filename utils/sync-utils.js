exports = module.exports;

exports.syncStatic = syncStatic;
exports.gitPull = gitPull;
exports.checkDiff = checkDiff;
exports.parseAndUpdate = parseAndUpdate;

var exec = require('child_process').exec;
var fd = require('../fileDeferrer');

function syncStatic(callback) {
    callback = callback || function () {};
    console.log('Syncing static files');
    exec('rsync -av --delete ./static/ /srv/static/blogjs/', callback);
}

function gitPull(ref, callback) {
    callback = callback || function () {};
    console.log('Pulling ref: ', ref);
    exec('git pull', callback);
}

function checkDiff(between, callback) {
    between = between || '';
    callback = callback || function () {};
    console.log('Getting diff ', between);
    exec('git diff --name-only ' + between, callback);
}

function parseAndUpdate(error, stdout, stderr, callback) {
    if (error) {
        console.error('Error while parsing output of git diff', error);
        return;
    }
    callback = callback || function () {
        console.log('All files have been updated');
    };
    var files = stdout.split('\n'); 
    var Article = require('mongoose').model('Article');
    for (var i = 0; i < files.length; i++) {
        if (/^posts\/[\w-_]+\.md$/.test(files[i])) {
            // This test is important, as md2html assumes all files match
            //  /xxxxxx.md$ format
            console.log('Parsing ', files[i]);
            fd.deferUpdate(files[i], function (fileName) {
                Article.updatePost(fileName, function (error, slug) {
                    if (error) {
                        console.error('githubWebHook - Tried to work with the %s post, failed', slug, error);
                        return;
                    }
                    console.log('Slug %s has been updated', slug);
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
