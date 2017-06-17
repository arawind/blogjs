const ArticleController = require('./Article');
module.exports = {
    article: new ArticleController(),
    github: require('./github')
};
