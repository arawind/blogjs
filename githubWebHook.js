module.exports = webhookInit;

var crypto = require('crypto');

function webhookInit(app, githubSecret) {
    app.post('/repoPush', function (req, res) {
        var hmac = crypto.createHmac('sha1', githubSecret);
        req.on('data', function (d) {
            hmac.update(d);
        });
        req.on('end', function () {
            console.log('hmac: ', hmac.digest('hex'));
        });
        res.sendStatus(201);
    });
}
