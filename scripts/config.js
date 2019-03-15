const path = require('path');

const package = require('../package.json');

// parse configuration from package.json
const options = package.options || {
  templateFile: 'openapi.yml',
  outputDir: 'build',
  port: 8117
};

module.exports = {
  ...options,
  templateFile: path.resolve(__dirname, '..', options.templateFile),
  outputDir: path.resolve(__dirname, '..', options.outputDir)
};
