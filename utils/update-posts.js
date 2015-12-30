exports = module.exports;

exports.diffCurrent = diffCurrent;
exports.all = updateAll;

var exec = require('child_process').exec;
var syncUtils = require('./sync-utils');
var logger = require('./logger');

function updateAll(callback) {  
    callback = callback || function () {};
    exec('bin/updateAllPosts', callback);
}

function diffCurrent(callback) {
    callback = callback || function () {};
    syncUtils.checkDiff('', function (error, stdout, stderr) {
        logger.trace('Parsing and updating\n', stdout.replace(/^/mg, 'File:: '));
        syncUtils.parseAndUpdate(error, stdout, stderr, callback);
    });
}
