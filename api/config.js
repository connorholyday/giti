
var dataSet = {
    port: 3000,
    maxCommits: 100,
    repos: {
        'ILEditor': '/Users/barry/Documents/test/ILEditor.git'
    }
}

exports.obj = {
    port: dataSet.port,
    maxCommits: dataSet.maxCommits,

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
}