module.exports = readSecret();

function readSecret() {
    try {
        var config = require('./secret.json'); 
        console.log('Loaded configuration: ', Object.keys(config));
        return config;
    } catch (err) {
        console.error('Unable to read secret.json');
        console.error(err);
        exit();
    }
}
