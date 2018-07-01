const express = require('express');
const basicAuth = require('express-basic-auth');
const app = express();
const GitClient = require('./git');
const config = require('./config.js').obj;

const REPO_NO_EXIST = {success: false, message: "Repo key does not exist."};

app.use(express.json());

if (config.useAuth()) {
    app.use(basicAuth({ 
        authorizer: config.userAuth, 
        unauthorizedResponse: function(req) {
            return req.auth
            ? ('Credentials rejected')
            : 'No credentials provided'
        } 
    }));

    app.post('/addUser', function(req, res) {
        var user = req.body.user;
        var pass = req.body.pass;

        req.json(config.addUser(user, pass));
    });
}

app.post('/addRepo', function(req, res) {
    var key = req.body.key;
    var path = req.body.path;

    res.json(config.addRepo(key, path));
});

app.get('/:key/log', function(req, res) {
    var repo = config.getRepo(req.params.key);

    if (repo !== undefined) {
        var git = new GitClient(repo);
        git.log(function(log) {
            res.json(log);
        });

    } else {
        res.json(REPO_NO_EXIST);
    }
});

app.get('/:key/log/:file', function(req, res) {
    var repo = config.getRepo(req.params.key);

    if (repo !== undefined) {
        var file = req.params.file;
        var git = new GitClient(repo);
        git.fileLog(file, function(log) {
            res.json(log);
        });
    } else {
        res.json(REPO_NO_EXIST);
    }
});

app.get('/:key/diff/:previous/:current', function(req, res) {
    var repo = config.getRepo(req.params.key);

    if (repo !== undefined) {
        var previous = req.params.previous;
        var current = req.params.current;

        var git = new GitClient(repo);
        git.commitDiff({previous: previous, current: current}, function(log) {
            res.json(log);
        })
    } else {
        res.json(REPO_NO_EXIST);
    }
});

app.get('/:key/diff/:previous/:current/:file', function(req, res) {

    var repo = config.getRepo(req.params.key);

    if (repo !== undefined) {
        var previous = req.params.previous;
        var current = req.params.current;
        var file = req.params.file;

        var git = new GitClient(repo);
        git.commitDiff({previous: previous, current: current, file: file}, function(log) {
            res.send(log);
        });
    } else {
        res.json(REPO_NO_EXIST);
    }
});

app.get('/:key/branches', function(req, res) {

    var repo = config.getRepo(req.params.key);

    if (repo !== undefined) {
        var git = new GitClient(repo);
        git.branches(function(log) {
            res.json(log);
        });
    } else {
        res.json(REPO_NO_EXIST);
    }
});

app.listen(3000, () => console.log('Example app listening on port 3000!'))