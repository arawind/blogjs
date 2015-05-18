var http = require('http');
var server = http.createServer(function (request, response) {
    response.write(JSON.stringify(request.headers));
    response.end('\n\n\nHey there, we\'re getting started on my blog! Checkout https://github.com/arawind/blogjs/tree/develop');
});
server.listen(8008);
