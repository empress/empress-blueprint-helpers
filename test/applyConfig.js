const { writeFileSync, readFileSync, unlinkSync } = require('fs');
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

  afterEach(function () {
    unlinkSync('./config/environment.js');
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

  it('can write config files with single values', function () {
    applyConfig({
      isEmberCLIAddon() { return false; },
    },
    'historySupportMiddleware', true);

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
    historySupportMiddleware: true
  };

  return ENV;
};`);
  });

  it('can overwrite config values when override is true', function () {
    applyConfig({
      isEmberCLIAddon() { return false; },
    },
    'locationType', 'trailing-history', true);

    const result = readFileSync('./config/environment.js', 'utf8');
    expect(result).to.equal(`'use strict';

module.exports = function(environment) {
  let ENV = {
    modulePrefix: 'dummy',
    environment,
    rootURL: '/',
    locationType: 'trailing-history',
    EmberENV: {},

    APP: {}
  };

  return ENV;
};`);
  });
});
