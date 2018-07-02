const express = require('express');
const app = express();
var pathLib = require('path');
var fs = require('fs');
let diff2html = require("diff2html").Diff2Html;

const CONFIG_PATH = pathLib.join(__dirname, 'config.json');
const config = require('./api/config').obj;
const GitClient = require('./api/git');

config.loadConfig(CONFIG_PATH);

app.use(express.json());
app.use(express.urlencoded());
app.use(express.static('public'));

app.set('views', __dirname + '/views')
app.set('view engine', 'pug');

app.get('/', function (req, res) {
    res.render('index', {results: config.getRepos()});
});

app.get('/dash/:key', function(req, res) {
    var name = req.params.key;
    var repo = config.getRepo(name);

    if (fs.existsSync(repo)) {
        var git = new GitClient(repo);

        var results = {name: name, path: repo, commits: [], branches: []};

        git.log(5, function(commits) {
            results.commits = commits.all;
            git.branches(function(branches) {
                for (var key in branches.branches)
                    results.branches.push(branches.branches[key]);

                res.render('dash', results);
            });
        });
    } else {
        res.render('error', {text: 'Git repo at path "' + repo + '" does not exist.', name: name});
    }
});

app.get('/commits/:key', function (req, res) {
    var repo = config.getRepo(req.params.key);
    var git = new GitClient(repo);
    git.log(config.maxCommits(), function(log) {
        log.name = req.params.key;
        log.path = repo;
        res.render('commits', log);
    });
});

app.get('/commits/:key/:hash', function(req, res) {
    var hash = req.params.hash;
    var repo = config.getRepo(req.params.key);
    var git = new GitClient(repo);
    git.show(hash, function(log) {
        var diffHtml, cacheKey = req.params.key + '-' + hash + '-diff';

        diffHtml = config.getCache(cacheKey);
        if (diffHtml === undefined) {
            diffHtml = Diff2Html.getPrettyHtml(
                log,
                {inputFormat: 'diff', showFiles: true, matching: 'lines', outputFormat: 'line-by-line'}
            );
            config.setCache(cacheKey, diffHtml);
        }

        var result = {
            name: req.params.key,
            path: repo,
            hash: hash,
            log: diffHtml
        };

        res.render('commit', result);
    });
});

app.get('/branches/:key', function(req, res) {
    var repo = config.getRepo(req.params.key);
    var git = new GitClient(repo);
    git.branches(function(log) {
        var results = [];
        for (var key in log.branches)
            results.push(log.branches[key]);
            
        res.render('branches', {name: req.params.key, branches: results});
    });
});

app.get('/tree/:key/:hash', function(req, res) {
    var hash = req.params.hash;
    var repo = config.getRepo(req.params.key);
    var git = new GitClient(repo);
    var cacheKey = req.params.key + '-' + hash + '-tree';

    var results = config.getCache(cacheKey);
    if (results === undefined) {
        git.treeAt(hash, function(log) {
            config.setCache(cacheKey, log);
            res.render('tree', {name: req.params.key, hash: hash, tree: log});
        });
    } else {
        res.render('tree', {name: req.params.key, hash: hash, tree: results});
    }
});

app.get('/blob/:key/:hash/:path', function(req, res) {
    var hash = req.params.hash;
    var repo = config.getRepo(req.params.key);
    var path = req.params.path;
    var cacheKey = req.params.key + '-' + hash + '-' + path + '-file';

    var ext = pathLib.extname(path);
    if (ext.length > 0)
        ext = ext.substring(1);

    var git = new GitClient(repo);

    var results = config.getCache(cacheKey);
    if (results === undefined) {
        git.fileAt(hash, path, function(log) {
            config.setCache(cacheKey, log);
            res.render('blob', {name: req.params.key, hash: hash, path: path, content: log, ext: ext});
        });
    } else {
        res.render('blob', {name: req.params.key, hash: hash, path: path, content: results, ext: ext});
    }
});

app.get('/addrepo', function(req, res) {
    res.render('addrepo');
});

app.post('/addrepo', function(req, res) {
    var key = req.body.name;
    var path = req.body.path;
    var init = (req.body.init !== undefined);

    if (key !== undefined) {
        if (key.trim() !== "") {
            if (config.getRepo(key) === undefined) {
                config.addRepo(key, path);
                config.saveConfig(CONFIG_PATH);

                if (init) {
                    var git = new GitClient(path);
                    git.init(true, function(log) {})
                }
            }
        }
    }

    res.redirect('/');
});

app.get('/remrepo/:key', function(req, res) {
    var key = req.params.key;

    if (config.getRepo(key) !== undefined) {
        config.remRepo(key);
        config.saveConfig(CONFIG_PATH);
    }

    res.redirect('/');
});

app.listen(config.port(), () => console.log('giti listening on port ' + config.port()));