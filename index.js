const express = require('express');
const app = express();

const config = require('./api/config').obj;
const apiLayer = require('./api/layer');

app.use(express.json());
app.use('/giti', apiLayer());
app.use(express.static('view'))

app.listen(config.port, () => console.log('giti listening on port ' + config.port));