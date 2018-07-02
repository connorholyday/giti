
const simpleGit = require('simple-git');
const EOL = '\n';

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
            var contents = log.split('\n');

            for (var i in contents) {
                results.push({
                    path: contents[i],
                    pathURI: encodeURIComponent(contents[i])
                });
            }

            fn(results);
        });
    }

    static parseTree(pathsArray) {
        var data = [];

        for(var i = 0 ; i< pathsArray.length; i++) {
            if (pathsArray[i].path === "") continue;
            buildTree(pathsArray[i].path.split('/'), data, pathsArray[i].pathURI);
        }
        
        return data;
        
        function buildTree(parts, treeNode, uri) {
            if(parts.length === 0)
                return; 

            for(var i = 0 ; i < treeNode.length; i++)
            {
                if(parts[0] == treeNode[i].text)
                {
                    buildTree(parts.splice(1, parts.length), treeNode[i].children, uri);
                    return;
                }
            }
            var newNode = {'text': parts[0], 'children': [], pathURI: uri};
            treeNode.push(newNode);
            buildTree(parts.splice(1, parts.length), newNode.children, uri);
        }
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