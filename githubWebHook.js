module.exports = webhookInit;

var crypto = require('crypto');
var exec = require('child_process').exec;

function webhookInit(app, githubSecret) {
    app.post('/repoPush', function (req, res) {
        verifyHMAC(req, githubSecret, function (error, statusCode) {
            if (error) {
                console.error('Couldn\'t verify HMAC', error);
            } else {
                req.body = JSON.parse(req.body);
                if (req.body.hasOwnProperty('ref') && app.get('current git ref') === req.body.ref) { 
                    pullGithub(req.body.ref, updatePosts);
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
    exec('git pull >/dev/null 2>&1 &', checkUpdatedFiles);
}

function checkUpdatedFiles() {
    exec('git diff --name-only HEAD~1 HEAD', parseListOfUpdatedFiles);
}

function parseListOfUpdatedFiles(error, stdout, stderr) {
    if (error) {
        console.error('Error while parsing output of git diff --name-only HEAD~1 HEAD', error);
        return;
    }
    var files = stdout.split('\n'); 
    var Article = require('mongoose').model('Article');
    for (var i = 0; i < files.length; i++) {
        if (/^posts\/.*\.md$/.test(files[i])) {
            // This test is important, as md2html assumes all files match
            //  /xxxxxx.md$ format
            Article.updatePost(files[i]);
        }
    }
}
