module.exports = md2html;

const spawn = require('child_process').spawn;
const fs = require('fs');
const logger = require('./logger');

function md2html(fileName, callback) {
    fs.readFile(fileName, {encoding: 'utf8'}, function (error, data) {
        if (error) {
            logger.error(error);
            return callback(error);
        }

        const lines = data.split('\n');
        let dropLines = 0;
        let meta = [];

        if (lines[0] === '---') {
            // Check if the first line is ---, meaning meta data is present
            while(lines[++dropLines] !== '---'); 
            // Increment dropLines till next --- is reached
            dropLines++;
            logger.trace('Dropping %d lines', dropLines);
            meta = lines.slice(1, dropLines - 1);
        }

        callConverter(fileName, meta, dropLines, callback);
    });
}

function callConverter(fileName, meta, dropLines, callback) {
    let data = '';
    let error = null;
    let errorData = '';
    const markupOutput = spawn('./bin/githubMarkup', [fileName, dropLines]);

    meta = parseMeta(fileName, meta);

    markupOutput.stdout.on('data', function (d) {
        data += d.toString('utf-8');
    });

    markupOutput.stderr.on('data', function (d) {
        errorData += d.toString('utf-8');
    });

    markupOutput.on('exit', function (code, signal) {
        if (code != 0 || signal !== null) {
            error = {
                message: 'Code: ' + code,
                errorDetails: errorData,
                signal: signal
            };
        }

        callback(error, data, meta, errorData);
    });
}

function parseMeta(fileName, meta) {
    const parsed = {};

    for (const i in meta) {
        const metaLine = meta[i];
        const metaLineArray = metaLine.split(':');
        parsed[metaLineArray[0]] = metaLineArray.slice(1).join(':').trim();
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

        logger.trace('Parsed tags from post', parsed['tags']);
    }

    return parsed;
}
