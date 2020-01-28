const { writeFileSync, readFileSync } = require('fs');
const { expect } = require('chai');
const { applyConfig } = require('../');

describe('applyConfig() function', function () {
  beforeEach(function () {
    writeFileSync('./config/environment.js', `'use strict';

module.exports = function(environment) {
  let ENV = {
    modulePrefix: 'dummy',
    environment,
    rootURL: '/',
    locationType: 'auto',
    EmberENV: {},

    APP: {}
  };

  return ENV;
};`);
  });

  it('can write config files with objects', function () {
    applyConfig({
      isEmberCLIAddon() { return false; },
    },
    'testFace', {
      test: 'face',
    });

    const result = readFileSync('./config/environment.js', 'utf8');
    expect(result).to.equal(`'use strict';

module.exports = function(environment) {
  let ENV = {
    modulePrefix: 'dummy',
    environment,
    rootURL: '/',
    locationType: 'auto',
    EmberENV: {},
    APP: {},

    testFace: {
      test: 'face'
    }
  };

  return ENV;
};`);
  });
});
