const ArticleController = require('./Article');
const GithubController = require('./Github')
module.exports = {
    article: new ArticleController(),
    github: new GithubController()
};
