var mongoose = require('mongoose');

var YoutubePlaylistSchema = new mongoose.Schema({
    _id: String,
    createdAt: {type: Date, default: Date.now},
    updatedAt: {type: Date, default: Date.now},
    etag: String,
    publishedAt: Date,
    channelId: String,
    channelTitle: String,
    title: String,
    thumbnails: mongoose.Schema.Types.Mixed,
    tags: [{type: String, lowercase: true, trim: true}],
    privacyStatus: {type: String, enum: ['private', 'public', 'unlisted']},
    isFavourite: Boolean,
    isDeleted: Boolean
});

YoutubePlaylistSchema.statics.insertFromAPI = insertFromAPI;

var YoutubePlaylist = mongoose.model('YoutubePlaylist', YoutubePlaylistSchema);

function insertFromAPI(apiData, cb) {
    return YoutubePlaylist.findOneAndUpdate({_id: apiData.id}, {
        _id: apiData.id,
        etag: apiData.etag,
        publishedDate: apiData.snippet.publishedDate,
        channelId: apiData.snippet.channelId,
        channelTitle: apiData.snippet.channelTitle,
        title: apiData.snippet.title,
        thumbnails: apiData.snippet.thumbnails,
        tags: apiData.snippet.tags,
        privacyStatus: apiData.status.privacyStatus,
        isFavourite: /^FL/.test(apiData.id) && apiData.snippet.title === 'Favorites',
        isDeleted: apiData.status.privacyStatus !== 'public'
    }, {upsert: true}, cb);
}
