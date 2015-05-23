module.exports = webhookInit;

var crypto = require('crypto');
var exec = require('child_process').exec;
//var bodyParser = require('body-parser');

function webhookInit(app, githubSecret) {
    //app.use('/repoPush', bodyParser.json());
    app.post('/repoPush', function (req, res) {
        verifyHMAC(req, githubSecret, function (error, statusCode) {
            if (error) {
                console.error('Couldn\'t verify HMAC', error);
            } else {
                req.body = JSON.parse(req.body);
                if (req.body.hasOwnProperty('ref') && app.get('current git ref') === req.body.ref) { 
                    pullGithub(ref);
                }
            }
            res.sendStatus(statusCode);
        });
    });
}

function verifyHMAC(req, githubSecret, returnStatus) {
    var signatureHeader = req.get('X-Hub-Signature') || '';
    var signature = signatureHeader.split('=')[1]; 
    var statusCode = 403;
    var error = {
        message: ''
    };
    if (typeof signature !== 'undefined') {
        console.log('Signature received: ', signature);
        var hmac = crypto.createHmac('sha1', githubSecret);
        var data = "";
        req.on('data', function (d) {
            data += d.toString('utf-8');
            hmac.update(d);
        });
        req.on('end', function () {
            req.body = data;
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

function pullGithub(ref) {
    console.log('Pulling ref: ', ref);
    exec('git pull >/dev/null 2>&1 &');
}
