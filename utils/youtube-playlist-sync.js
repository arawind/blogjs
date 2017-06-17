const request = require('request');
const async = require('async');
const mongoose = require('mongoose');
const config = require('../config');
const logger = require('../utils/logger');

module.exports = new YoutubePlaylistSync();

function YoutubePlaylistSync() {
    const self = this;

    self.BASE_URL = 'https://www.googleapis.com/youtube/v3';
    self.MAX_RESULTS = 50;

    self.getChannelPlaylists = function (id, cb) {
        return getAllItems(self, getChannelPlaylists, {id: id}, null, cb);
    };

    self.getPlaylistVideos = function (id, cb) {
        return getAllItems(self, getPlaylistItems, {id: id}, null, cb);
    };

    self.sync = function (cb) {
        return sync(self, cb);
    };
}

function mergeArrays(a, b) {
    for (let i = 0; i < b.length; i++) {
        a.push(b[i]);
    }

    return a;
}

function getAllItems(self, fn, args, pageToken, cb) {
    fn(self, args, pageToken, function (err, res) {
        if (err) {
            return cb(err);
        }

        if (!res.nextPageToken) {
            return cb(null, res.items);
        }

        return getAllItems(self, fn, args, res.nextPageToken, function (err, items) {
            if (err) {
                return cb(err);
            }

            return cb(null, mergeArrays(items, res.items));
        });
    })
}

function getChannelPlaylists(self, args, pageToken, cb) {
    const qs = {
        part: 'status,snippet',
        channelId: args.id,
        maxResults: self.MAX_RESULTS,
        key: config.secret.googleAPIKey
    };

    if (pageToken) {
        qs.pageToken = pageToken;
    }

    request.get({
        url: self.BASE_URL + '/playlists',
        qs: qs,
        json: true
    }, function (err, response, body) {
        if (err) {
            return cb(err);
        }

        if (!body || !body.items) {
            logger.error('Failed getting the playlists', response.statusCode, response.body);
            return cb(new Error('Failed to get the playlists'));
        }

        return cb(null, body);
    });
}

function getPlaylistItems(self, args, pageToken, cb) {
    const qs = {
        part: 'status,snippet',
        playlistId: args.id,
        maxResults: self.MAX_RESULTS,
        key: config.secret.googleAPIKey
    };

    if (pageToken) {
        qs.pageToken = pageToken;
    }

    request.get({
        url: self.BASE_URL + '/playlistItems',
        qs: qs,
        json: true
    }, function (err, response, body) {
        if (err) {
            return cb(err);
        }

        if (!body || !body.items) {
            logger.error('Failed getting the playlist items', response.statusCode, response.body);
            return cb(new Error('Failed to get the playlist items'));
        }

        return cb(null, body);
    });
}

function sync(self, cb) {
    syncPlaylists(self, config.secret.channelId, function (err, playlists) {
        if (err) {
            return cb(err);
        }

        async.forEach(playlists, function (playlist, callback) {
            syncVideosForPlaylist(self, playlist.id, callback);
        }, function (err) {
            if (err) {
                return cb(err);
            }

            return cb(null);
        });
    });
}

function syncPlaylists(syncer, channelId, cb) {
    syncer.getChannelPlaylists(channelId, function (err, playlists) {
        if (err) {
            return cb(err);
        }

        async.forEach(playlists, savePlaylist, function (err) {
            if (err) {
                return cb(err);
            }

            return cb(null, playlists);
        });
    });
}

function syncVideosForPlaylist(syncer, playlistId, cb) {
    syncer.getPlaylistVideos(playlistId, function (err, videos) {
        if (err) {
            return cb(err);
        }

        async.forEach(videos, saveVideo, function (err) {
            if (err) {
                return cb(err);
            }

            return cb(null);
        });
    });
}

function savePlaylist(playlist, cb) {
    return mongoose
        .model('YoutubePlaylist')
        .insertFromAPI(playlist, cb);
}

function saveVideo(video, cb) {
    return mongoose
        .model('YoutubeVideo')
        .insertFromAPI(video, cb);
}
