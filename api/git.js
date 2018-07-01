
const simpleGit = require('simple-git');
const config = require('./config').obj;

module.exports = class GitClient {
    constructor(workingPath) {
        this.client = simpleGit(workingPath);
    }

    log(fn) {
        this.client.log(['-' + config.maxCommits], function(err, log) {
            fn(log);
        });
    }

    fileLog(file, fn) {
        this.client.log(['--', file], function(err, log) {
            fn(log);
        });
    }

    show(commit, fn) {
        this.client.show([commit], function(err, log) {
            fn(log);
        });
    }

    branches(fn) {
        this.client.branch(function(err, log) {
            fn(log);
        });
    }
}