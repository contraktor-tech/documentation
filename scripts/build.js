const util = require('util');
const path = require('path');
const { readFileSync, writeFileSync } = require('fs');
const mkdirp = require('mkdirp');
const glob = util.promisify(require('glob'));

const config = require('./config');
const translate = require('../lib/translate');

async function main() {
  // read the templates
  const specTemplate = readFileSync(config.templateFile, 'utf8').toString();
  const indexTemplate = readFileSync(path.resolve(__dirname, 'index.html'), 'utf-8');

  // loop through translations available
  const localeFiles = await glob(path.resolve(__dirname, '../locales/*.+(yml|yaml)'));  
  localeFiles.forEach((localeFile) => {
    // extract the name of the locale from the filename ('en-us' from 'locales/en-us.yml')
    const locale = path.basename(localeFile).replace(/\.(yml|yaml)$/i, '');

    // translate the template spec to the desired locale
    const translated = translate(specTemplate, locale);

    // write the translated spec to the outputDir
    mkdirp.sync(path.resolve(config.outputDir, locale));
    writeFileSync(path.resolve(config.outputDir, locale, 'openapi.yml'), translated);
    writeFileSync(path.resolve(config.outputDir, locale, 'index.html'), indexTemplate);
  });
}

main();