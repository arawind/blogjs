exports = module.exports;

exports.diffCurrent = diffCurrent;
exports.all = updateAll;

var exec = require('child_process').exec;
var syncUtils = require('./sync-utils');

function updateAll(callback) {  
    callback = callback || function () {};
    exec('bin/updateAllPosts', callback);
}

function diffCurrent(callback) {
    callback = callback || function () {};
    syncUtils.checkDiff('', function (error, stdout, stderr) {
        console.log('Parsing and updating\n', stdout.replace(/^/mg, 'File:: '));
        syncUtils.parseAndUpdate(error, stdout, stderr, callback);
    });
}
