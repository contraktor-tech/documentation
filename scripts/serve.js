const path = require('path');
const { readFileSync } = require('fs');
const express = require('express');
const proxy = require('http-proxy-middleware');

const config = require('./config');
const translate = require('../lib/translate');

// read the templates files (api spec and index.html)
const indexTemplate = readFileSync(path.resolve(__dirname, 'index.html'), 'utf-8');

const app = express();

// If you need a backend, e.g. an API, add your custom backend-specific middleware here
app.use('/api', proxy({
  target: 'http://localhost:4000',
  changeOrigin: true
}));

app.get('/:locale/openapi.yml', (req, res) => {
  const specTemplate = readFileSync(config.templateFile, 'utf8').toString();
  res.send(translate(specTemplate, req.params.locale));
});

app.get('/:locale/', (req, res) => {
  res.send(indexTemplate);
});

app.get('/', (req, res) => {
  res.redirect('/en-us/');
});

app.listen(config.port, () => console.log(`Serving on port ${config.port}...`));
