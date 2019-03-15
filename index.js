const { readFileSync } = require('fs');
const YAML = require('yaml');

const translate = require('./lib/translate');

const spec = readFileSync('openapi.yml', 'utf8').toString();

module.exports = {
  enUS: YAML.parse(translate(spec, 'en-us')),
  ptBR: YAML.parse(translate(spec, 'pt-br'))
};
