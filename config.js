var exec = require('child_process').exec;
var express = require('express');
var mongoose = require('mongoose');
var moment = require('moment');
var syncUtils = require('./utils/sync-utils');
var updatePosts = require('./utils/update-posts');
var logger = require('./utils/logger');

exports = module.exports;
exports.secret = readSecret();
exports.configureApp = configureApp;

configureDb();

function readSecret() {
    try {
        var config = require('./secret.json'); 
        logger.info('Loaded configuration: ', Object.keys(config));
        return config;
    } catch (err) {
        logger.error('Unable to read secret.json');
        logger.error(err);
        process.exit(1);
    }
}

function configureApp(app) {
    app.set('view engine', 'jade');

    app.use(function (req, res, next) {
        req.req_id = (new Date).getTime() + Math.random();

        req.logger = logger.child({
            req_id: req.req_id,
            url: req.url,
            method: req.method,
            headers: req.headers
        });

        next();
    });

    moment.locale('en', {
        calendar: {
            lastDay : '[Yesterday at] LT',
            sameDay : '[Today at] LT',
            nextDay : '[Tomorrow at] LT',
            lastWeek : '[Last] dddd [at] LT',
            nextWeek : 'dddd [at] LT',
            sameElse: 'MMM Do, YYYY'
        }
    });

    if (exports.secret['env'] === 'development') {
        // Development environment:
        // Sync static files on reload
        // Update posts on reload

        app.use('/static', express.static('static'));

        app.use(function (req, res, next) {
            updatePosts.diffCurrent(function () {
                next();
            });
        });
    }

    exec('git symbolic-ref HEAD', function (error, stdout, stderr) {
        if (error) {
            logger.error('Error while executing git symbolic-ref HEAD', error);
            logger.error(stderr);
            process.exit(1);
        }

        var gitref = stdout.replace(/\s/g, '');
        logger.trace('Setting current git ref as: ', gitref);
        logger.trace('Git ref base64', new Buffer(gitref, 'utf-8').toString('base64'));
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
    mongoose.connection.on('error', logger.error);
    mongoose.connection.on('disconnected', connect);
}
