module.exports = md2html

var spawn = require('child_process').spawn;
var fs = require('fs');

function md2html(fileName, callback) {
    fs.readFile(fileName, {encoding: 'utf8'}, function (error, data) {
        if (error) {
            console.error(error);
            return callback(error);
        }
        var lines = data.split('\n');
        var dropLines = 0;
        var meta = [];
        if (lines[0] === '---') {
            // Check if the first line is ---, meaning meta data is present
            while(lines[++dropLines] !== '---'); 
            // Increment dropLines till next --- is reached
            dropLines++;
            console.log('Dropping %d lines', dropLines);
            meta = lines.slice(1, dropLines - 1);
        }
        callConverter(fileName, meta, dropLines, callback);
    });
}

function callConverter(fileName, meta, dropLines, callback) {
    var data = '';
    var error = null;
    var errorData = '';
    var markupOutput = spawn('./bin/githubMarkup', [fileName, dropLines]);
    meta = parseMeta(fileName, meta);
    markupOutput.stdout.on('data', function (d) {
        data += d.toString('utf-8');
    });
    markupOutput.stderr.on('data', function (d) {
        errorData += d.toString('utf-8');
    });
    markupOutput.on('exit', function (code, signal) {
        if (code != 0 || signal !== null) {
            error = {message: 'Code: ' + code, errorDetails: errorData, signal: signal};
        }
        callback(error, data, meta, errorData);
    });
}

function parseMeta(fileName, meta) {
    var parsed = {};
    var metaLine = '';
    var metaLineArray = [];
    var metaKey = '';
    var metaValue = '';
    for (var i in meta) {
        metaLine = meta[i];
        metaLineArray = metaLine.split(':');
        metaKey = metaLineArray[0];
        metaValue = metaLineArray.slice(1).join(':');
        parsed[metaKey] = metaValue.trim();
    }
    if (!parsed.hasOwnProperty('slug')) {
        // Add slug from file name if there is no slug meta
        parsed['slug'] = fileName.trim().match(/\/([\w-_]+).md$/)[1];
    }
    if (parsed.hasOwnProperty('tags')) {
        parsed['tags'] = parsed['tags'].split(',');
        if (parsed['tags']) {
            parsed['tags'] = parsed['tags'].map(function (e) {
                return e.trim();
            });
        }
        console.log('Parsed tags from post', parsed['tags']);
    }
    return parsed;
}
