module.exports = webhookInit;

var crypto = require('crypto');

function webhookInit(app, githubSecret) {
    app.post('/repoPush', function (req, res) {
        verifyHMAC(req, function (error, statusCode) {
            if (error) {
                console.error('Couldn\'t verify HMAC', error);
            }
            res.sendStatus(statusCode);
        });
    });
}

function verifyHMAC(req, returnStatus) {
    var signatureHeader = req.get('X-Hub-Signature') || '';
    var signature = signatureHeader.split('=')[1]; 
    var statusCode = 403;
    var error = {
        message: ''
    };
    if (typeof signature !== 'undefined') {
        console.log('Signature received: ', signature);
        var hmac = crypto.createHmac('sha1', githubSecret);
        req.on('data', function (d) {
            hmac.update(d);
        });
        req.on('end', function () {
            var digest = hmac.digest('hex');
            console.log('HMAC generated: ', digest);
            if (digest === signature) {
                statusCode = 204;
                return returnStatus(null, statusCode);
            }
            error.message = 'Signature mismatch';
            return returnStatus(error, statusCode);
        });
    } else {
        error.message = 'No header available';
        return returnStatus(error, statusCode);
    }
}
