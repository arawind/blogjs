var exec = require('child_process').exec;
var express = require('express');
var mongoose = require('mongoose');
var morgan = require('morgan');
var moment = require('moment');
var syncUtils = require('./utils/sync-utils');
var updatePosts = require('./utils/update-posts');

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
    app.set('view engine', 'jade');
    app.use(morgan('combined'));
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
        app.use(function (req, res, next) {
            updatePosts.diffCurrent(function () {
                next();
            });
        }, function (req, res, next) {
            syncUtils.syncStatic(function () {
                next();
            });
        });

        app.use('/static', express.static('static'));
    }
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
