const path = require('path');
const { readFileSync } = require('fs');
const Handlebars = require('handlebars');
const Polyglot = require('node-polyglot');
const YAML = require('yaml');
const faker = require('faker');
const lodash = require('lodash');

function translate(template, locale) {
  // load the phrases from the specified locale file
  const phrasesFile = readFileSync(path.resolve(__dirname, `../locales/${locale}.yml`), 'utf8');
  const phrases = YAML.parse(phrasesFile);

  // create a new instance of Polyglot
  const polyglot = new Polyglot({
    phrases
  });

  faker.locale = findFakerLocale(locale);

  // create a new instance of handlerbars
  const handlebars = Handlebars.create();
  // register a handlebars helper to translate strings using polyglot
  handlebars.registerHelper('t', (key) => polyglot.t(key));
  // register a handlerbars helper to generate fake strings
  handlebars.registerHelper('faker', (key) => {
    const gen = lodash.get(faker, key);
    return (typeof gen === 'function') ? gen() : key;
  });

  // compile & render the template
  const compiledTemplate = handlebars.compile(template);
  return compiledTemplate();
}

function findFakerLocale(locale) {
  const fakerLocale = Object.keys(faker.locales).find((l) => {
    return l.toLowerCase() === locale.replace(/\-/, '_');
  });

  return fakerLocale || 'en-US';
}

module.exports = translate;
