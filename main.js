var http = require('http');
var md2html = require('./md2html');
var server = http.createServer(function (request, response) {
    response.writeHead(200, {'Content-Type': 'text/html'});
    response.write('Converting posts/welcome.md to html\n');
    respond(response);
});
server.listen(8008);
function respond(response) {
    md2html('posts/Welcome.md', function(error, stdout, stderr) {
        if (error) {
            console.log(error);
            console.log(stderr);
        }
        response.write(stdout);
        response.end('\n\n\nSorry for the badass Times New Roman, but tells you that this is a way too basic an app! ;)');
    });
}
