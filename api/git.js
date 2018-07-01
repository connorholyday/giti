
const simpleGit = require('simple-git');

module.exports = class GitClient {
    constructor(workingPath) {
        this.client = simpleGit(workingPath);
    }

    log(fn) {
        this.client.log(['-50'], function(err, log) {
            fn(log);
        });
    }

    fileLog(file, fn) {
        this.client.log(['--', file], function(err, log) {
            fn(log);
        });
    }

    commitDiff(options, fn) {
        var params = [options.previous, options.current];

        if (options.file !== undefined) {
            params.push('--')
            params.push(options.file);
        }

        this.client.diff(params, function(err, log) {
            fn(log);
        });
    }

    branches(fn) {
        this.client.branch(function(err, log) {
            fn(log);
        });
    }
}