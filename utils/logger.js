const bunyan = require('bunyan');
const pkg = require('../package.json');
const logger = bunyan.createLogger({
    name: pkg.name,
    serializers: bunyan.stdSerializers,
    streams: [
        {
            type: 'rotating-file',
            path: pkg.name + '.log',
            period: '1d',
            level: 'info',
            count: 3
        },
        {
            level: 'trace',
            stream: process.stdout
        }
    ]
});

module.exports = logger;
