const express = require('express');
const app = express();
var path = require('path');
let diff2html = require("diff2html").Diff2Html;

const CONFIG_PATH = path.join(__dirname, 'config.json');
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

    var git = new GitClient(repo);

    var results = config.getCache(cacheKey);
    if (results === undefined) {
        git.fileAt(hash, path, function(log) {
            config.setCache(cacheKey, log);
            res.render('blob', {name: req.params.key, hash: hash, path: path, content: log});
        });
    } else {
        res.render('blob', {name: req.params.key, hash: hash, path: path, content: results});
    }
});

app.get('/addrepo', function(req, res) {
    res.render('addrepo');
});

app.post('/addrepo', function(req, res) {
    console.log(req);
    if (req.body.name !== undefined) {
        if (config.getRepo(req.body.name) === undefined) {
            config.addRepo(req.body.name, req.body.path);
            config.saveConfig(CONFIG_PATH);
        }
    }

    res.redirect('/');
});

app.listen(config.port(), () => console.log('giti listening on port ' + config.port()));