const crypto = require('crypto');
const syncUtils = require('../utils/sync-utils.js');
const logger = require('../utils/logger.js');
const config = require('../config');

module.exports = {
    webHook
};

function webHook(req, res) {
    verifyHMAC(req, function (error, statusCode) {
        if (error) {
            req.logger.error('Couldn\'t verify HMAC', error);
        } else {
            try {
                req.body = JSON.parse(req.body);
            } catch (e) {
                req.logger.error(e, 'Could not parse body', req.body);
                return res.sendStatus(400);
            }

            if (req.body.hasOwnProperty('ref') && config.gitref === req.body.ref) {
                syncUtils.gitPull(req.body.ref, function () {
                    // Also sync static files
                    syncUtils.syncStatic(function (error, stdout, stderr) {
                        if (error) {
                            logger.error('Error syncing static files', error);
                            logger.error(stderr);
                        }

                        logger.trace('Output of static sync', stdout);
                    });

                    syncUtils.checkDiff('HEAD~1 HEAD', syncUtils.parseAndUpdate);
                });
            }
        }

        return res.sendStatus(statusCode);
    });
}

function verifyHMAC(req, returnStatus) {
    const signatureHeader = req.get('X-Hub-Signature') || '';
    const signature = signatureHeader.split('=')[1];
    const error = {
        message: ''
    };
    let statusCode = 403;

    if (typeof signature !== 'undefined') {
        logger.info('Signature received: ', signature);

        const hmac = crypto.createHmac('sha1', config.secret.githubDeployKey);
        let data = "";

        req.on('data', function (d) {
            data += d.toString('utf-8');
            hmac.update(d);
        });

        req.on('end', function () {
            const digest = hmac.digest('hex');

            logger.trace('HMAC generated: ', digest);

            if (digest === signature) {
                statusCode = 204;
                req.body = data;
                return returnStatus(null, statusCode);
            }

            error.message = 'Signature mismatch';

            return returnStatus(error, statusCode);
        });
    } else {
        error.message = 'No header availalable';

        return returnStatus(error, statusCode);
    }
}
