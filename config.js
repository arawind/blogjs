var exec = require('child_process').exec;
var mongoose = require('mongoose');

exports = module.exports;
exports.secret = readSecret();
exports.configureApp = configureApp;
configureDb();

function readSecret() {
    try {
        var config = require('./secret.json'); 
        console.log('Loaded configuration: ', Object.keys(config));
        return config;
    } catch (err) {
        console.error('Unable to read secret.json');
        console.error(err);
        process.exit(1);
    }
}

function configureApp(app) {
    exec('git symbolic-ref HEAD', function (error, stdout, stderr) {
        if (error) {
            console.error('Error while executing git symbolic-ref HEAD', error);
            console.error(stderr);
            process.exit(1);
        }
        var gitref = stdout.replace(/\s/g, '');
        console.log('Setting current git ref as: ', gitref);
        console.log('Git ref base64', new Buffer(gitref, 'utf-8').toString('base64'));
        app.set('current git ref', gitref); 
    });
}

function configureDb() {
    function connect() {
        mongoose.connect('mongodb://localhost/blog', {
            server: {
                socketOptions: {
                    keepAlive: 1
                }
            }        
        });
    }
    connect();
    mongoose.connection.on('error', console.log);
    mongoose.connection.on('disconnected', connect);
}
