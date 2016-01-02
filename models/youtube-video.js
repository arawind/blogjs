var mongoose = require('mongoose');

var YoutubeVideoSchema = new mongoose.Schema({
    _id: String,
    videoId: {type: String, index: true},
    createdAt: {type: Date, default: Date.now},
    updatedAt: {type: Date, default: Date.now},
    etag: String,
    publishedAt: Date,
    channelId: String,
    channelTitle: String,
    title: String,
    thumbnails: mongoose.Schema.Types.Mixed,
    privacyStatus: {type: String, enum: ['private', 'public', 'unlisted']},
    playlistId: {type: String, ref: 'YoutubePlaylist'},
    isDeleted: Boolean
});

YoutubeVideoSchema.statics.insertFromAPI = insertFromAPI;

var YoutubeVideo = mongoose.model('YoutubeVideo', YoutubeVideoSchema);

function insertFromAPI(apiData, cb) {
    return YoutubeVideo.findOneAndUpdate({_id: apiData.id}, {
        _id: apiData.id,
        etag: apiData.etag,
        videoId: apiData.snippet.resourceId.videoId,
        publishedDate: apiData.snippet.publishedDate,
        channelId: apiData.snippet.channelId,
        channelTitle: apiData.snippet.channelTitle,
        title: apiData.snippet.title,
        thumbnails: apiData.snippet.thumbnails,
        privacyStatus: apiData.status.privacyStatus,
        isDeleted: apiData.status.privacyStatus !== 'public'
    }, {upsert: true}, cb);
}
