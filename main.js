var express = require('express');
var md2html = require('./md2html');
var PORT = 8008; // TODO: Make it configurable
var app = express();

var server = app.listen(PORT, function () {
    console.log('App listening at http://%s:%s', server.address().host, server.address().port);
});

app.get('/', function (req, res) {
    respond('Welcome', res);
});

app.get('/posts/:postName([a-zA-Z0-9-_]+)', function (req, res) {
    var postName = req.params.postName;
    console.log(postName);
    respond(postName, res);
});

function respond(postName, response) {
    postName = postName || 'Welcome';
    md2html('posts/' + postName + '.md', function(error, stdout, stderr) {
        if (error) {
            console.log(error);
            console.log(stderr);
        }
        response.write(stdout);
        response.end('\n\n\nSorry for the badass serif, but tells you that this is a way too basic an app! ;)');
    });
}
