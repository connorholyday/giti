const express = require('express');
const basicAuth = require('express-basic-auth');
const app = express();
const GitClient = require('./git');
const config = require('./config.js').obj;

if (config.useAuth()) {
    app.use(basicAuth( { authorizer: config.userAuth } ));

    app.get('/addUser/:user/:pass', function(req, res) {
        var user = req.params.user;
        var pass = req.param.pass;

        req.json(config.addUser(user, pass));
    });
}

app.get('/log', function(req, res) {
    var git = new GitClient("/Users/barry/Documents/test/ILEditor.git");
    git.log(function(log) {
        res.json(log);
    });
});

app.get('/log/:file', function(req, res) {
    var file = req.params.file;
    var git = new GitClient("/Users/barry/Documents/test/ILEditor.git");
    git.fileLog(file, function(log) {
        res.json(log);
    });
});

app.get('/diff/:previous/:current', function(req, res) {
    var previous = req.params.previous;
    var current = req.params.current;

    var git = new GitClient("/Users/barry/Documents/test/ILEditor.git");
    git.commitDiff({previous: previous, current: current}, function(log) {
        res.json(log);
    })
});

app.get('/diff/:previous/:current/:file', function(req, res) {
    var previous = req.params.previous;
    var current = req.params.current;
    var file = req.params.file;

    var git = new GitClient("/Users/barry/Documents/test/ILEditor.git");
    git.commitDiff({previous: previous, current: current, file: file}, function(log) {
        res.send(log);
    });
});

app.get('/branches', function(req, res) {
    var git = new GitClient("/Users/barry/Documents/test/ILEditor.git");
    git.branches(function(log) {
        res.json(log);
    })
});

app.listen(3000, () => console.log('Example app listening on port 3000!'))