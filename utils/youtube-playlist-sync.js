var request = require('request');
var config = require('../config');

module.exports = new YoutubePlaylistSync();

function YoutubePlaylistSync() {
    var self = this;

    self.BASE_URL = 'https://www.googleapis.com/youtube/v3';
    self.MAX_RESULTS = 1;

    self.getChannelPlaylists = function (cb) {
        return getAllItems(self, getChannelPlaylists, null, cb);
    };

    self.getChannelPlaylists(function (err, items) {
        console.log(err, items);
    });
}

function mergeArrays(a, b) {
    for (var i = 0; i < b.length; i++) {
        a.push(b[i]);
    }

    return a;
}

function getAllItems(self, fn, pageToken, cb) {
    fn(self, pageToken, function (err, res) {
        if (err) {
            return cb(err);
        }

        if (!res.nextPageToken) {
            return cb(null, res.items);
        }

        return getAllItems(self, fn, res.nextPageToken, function (err, items) {
            if (err) {
                return cb(err);
            }

            return cb(null, mergeArrays(items, res.items));
        });
    })
}

function getChannelPlaylists(self, pageToken, cb) {
    var qs = {
        part: 'status,snippet',
        channelId: config.secret.channelId,
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

        if (!body) {
            return cb(new Error('Failed to get the playlists'));
        }

        return cb(null, body);
    });
}
