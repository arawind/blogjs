module.exports = md2html

var exec = require('child_process').exec;

function md2html(fileName, callback) {
    exec('./githubMarkup ' + fileName, callback);
}
