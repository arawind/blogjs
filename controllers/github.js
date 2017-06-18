const crypto = require('crypto');
const logger = require('../utils/logger.js');
const config = require('../config');
const syncUtils = require('../utils/sync-utils.js');

class GithubController {
    constructor() {
        this.webHook = this.webHook.bind(this);
        this.readBody = this.readBody.bind(this);
    }

    async webHook(ctx) {
        const signatureHeader = ctx.get('X-Hub-Signature');

        if (!signatureHeader) {
            throw new Error('No signature');
        }

        const signature = signatureHeader.split('=')[1];
        const body = await this.readBody(ctx.req);
        const hmac = crypto.createHmac('sha1', config.secret.githubDeployKey).update(body).digest('hex');

        if (hmac === signature) {
            throw new Error('Signature mismatch');
        }

        const parsedBody = JSON.parse(body);

        if (parsedBody.hasOwnProperty('ref') && config.gitref === parsedBody.ref) {
            syncUtils.gitPull(parsedBody.ref, function () {
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

        return ctx.res.statusCode = 204;
    }

    async readBody(req) {
        return new Promise((resolve) => {
            let data = '';

            req.on('data', (d) => {
                data += d.toString('utf-8');
            });

            req.on('end', () => {
                resolve(data)
            });
        });
    }
}

module.exports = GithubController
