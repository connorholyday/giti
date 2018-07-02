var fs = require('fs');

var dataSet = {
    port: 3000,
    maxCommits: 100,
    repos: {
        // 'Repo Name': '/path/to/repo'
    }
}

var cache = {};

exports.obj = {
    loadConfig: function(path) {
        if (PathExists(path)) {
            dataSet = JSON.parse(ReadContent(path));
        } else {
            console.log('Config does not exist! Creating: ' + path);
            this.saveConfig(path);
        }
    },

    saveConfig: function(path) {
        WriteContent(path, JSON.stringify(dataSet, null, 4));
    },

    port: function() {return dataSet.port},
    maxCommits: function() {return dataSet.maxCommits},

    addRepo: function(key, path) {
        var result = {success: true};

        if (dataSet.repos[key] === undefined)
            dataSet.repos[key] = path;
        else {
            result.message = "Key already exists.";
            result.success = false;
        }

        return result;
    },
    remRepo: function(key) {
        delete dataSet.repos[key];
    },
    getRepo: function(key) {
        return dataSet.repos[key];
    },
    getRepos: function() {
        var repos = [];

        for (var repo in dataSet.repos) {
            repos.push({path: dataSet.repos[repo], name: repo});
        }

        return repos;
    },

    getCache(key) {
        return cache[key];
    },

    setCache(key, value) {
        cache[key] = value;
    }
}

function ReadContent(file) {
    return fs.readFileSync(file, 'utf8');
  }
  
function PathExists(pathaddr) {
    return fs.existsSync(pathaddr);
}

function WriteContent(pathOut, content) {
    fs.writeFileSync(pathOut, content);
  }
