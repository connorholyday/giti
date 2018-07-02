
const simpleGit = require('simple-git');
const EOL = require('os').EOL;

module.exports = class GitClient {
    constructor(workingPath) {
        this.client = simpleGit(workingPath);
    }

    init(bare, fn) {
        this.client.init(bare, function(err, log) {
            fn(log);
        });
    }

    log(count, fn) {
        this.client.log(['-' + count], function(err, log) {
            if (log === null)
                log = {all: []};

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

    treeAt(commit, fn) {
        var results = [];

        this.client.raw(['ls-tree', '-r', commit, '--name-only'], function(err, log) {
            var contents = log.split(EOL);

            for (var i in contents) {
                results.push({
                    path: contents[i],
                    pathURI: encodeURIComponent(contents[i])
                });
            }

            fn(results);
        });
    }

    fileAt(commit, path, fn) {
        this.client.show([commit + ':' + path], function(err, log) {
            fn(log);
        });
    }

    branches(fn) {
        this.client.branch(function(err, log) {
            fn(log);
        });
    }
}