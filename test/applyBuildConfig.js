const { writeFileSync, readFileSync, unlinkSync } = require('fs');
const { expect } = require('chai');

const { applyBuildConfig } = require('..');

describe('applyBuildConfig() function', function () {
  beforeEach(function () {
    writeFileSync('./ember-cli-build.js', `'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function(defaults) {
  let app = new EmberApp(defaults, {});

  return app.toTree();
};`);
  });

  afterEach(function () {
    unlinkSync('./ember-cli-build.js');
  });

  it('can add config', function () {
    applyBuildConfig('fingerprint', {
      extensions: ['js', 'css', 'map'],
    });

    const result = readFileSync('./ember-cli-build.js', 'utf8');
    expect(result).to.equal(`'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function(defaults) {
  let app = new EmberApp(defaults, {
    fingerprint: {
      extensions: ['js', 'css', 'map']
    }
  });

  return app.toTree();
};`);
  });
});
