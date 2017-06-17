module.exports = {
    diffCurrent,
    all: updateAll
};

const exec = require('child_process').exec;
const syncUtils = require('./sync-utils');
const logger = require('./logger');

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
