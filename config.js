module.exports = {
    secret: readSecret(),
    configureApp: configureApp
};

var exec = require('child_process').exec;

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
        console.log('Setting current git ref as: ', stdout);
        app.set('current git ref', stdout); 
    });
}
