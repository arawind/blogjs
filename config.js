const exec = require('child_process').exec;
const express = require('express');
const mongoose = require('mongoose');
const moment = require('moment');
const updatePosts = require('./utils/update-posts');
const logger = require('./utils/logger');

const config = module.exports;
config.secret = readSecret();
config.configureApp = configureApp;
config.gitref = '';

configureDb();

function readSecret() {
    try {
        const secret = require('./secret.json');
        logger.info('Loaded configuration: ', Object.keys(secret));
        return secret;
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

    if (config.secret['env'] === 'development') {
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

        config.gitref = stdout.replace(/\s/g, '');
        logger.trace('Setting current git ref as: ', config.gitref);
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
    mongoose.connection.on('error', function (err) {
        logger.error('mongo connection failed', err);
    });
    mongoose.connection.on('disconnected', connect);

    // Models
    require('./models');
}
