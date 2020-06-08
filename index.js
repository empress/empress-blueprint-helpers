const recast = require('recast');
const { readFileSync, writeFileSync } = require('fs');

const { builders } = recast.types;

function buildKey(configKey) {
  return configKey.includes('-') ? builders.literal(configKey) : builders.identifier(configKey);
}

function buildValue(configObject) {
  if (typeof configObject === 'object') {
    // eslint-disable-next-line arrow-body-style
    return builders.objectExpression(Object.keys(configObject).map((objKey) => {
      const currentValue = configObject[objKey];
      let currentValueNode;

      if (Array.isArray(currentValue)) {
        currentValueNode = builders.arrayExpression(
          currentValue.map(item => buildValue(item)),
        );
      } else {
        currentValueNode = builders.literal(currentValue);
      }
      return builders.property('init', builders.identifier(objKey), currentValueNode);
    }));
  }

  return builders.literal(configObject);
}

function applyConfig(project, configKey, configObject, override = false) {
  let configFile = './config/environment.js';

  if (project.isEmberCLIAddon()) {
    configFile = './tests/dummy/config/environment.js';
  }

  const config = readFileSync(configFile);
  const configAst = recast.parse(config);

  const key = buildKey(configKey);
  const value = buildValue(configObject);

  recast.visit(configAst, {
    // eslint-disable-next-line consistent-return
    visitVariableDeclaration(path) {
      const { node } = path;

      const env = node.declarations.find(declaration => declaration.id.name === 'ENV');

      if (env) {
        let configFileObj = env.init.properties.find(
          property => property.key.value === configKey || property.key.name === configKey,
        );

        if (!configFileObj) {
          configFileObj = builders.property(
            'init',
            key,
            value,
          );
          env.init.properties.push(configFileObj);
        } else if (override) {
          configFileObj.value = value;
        }

        return false;
      }

      this.traverse(path);
    },
  });

  writeFileSync(configFile, recast.print(configAst, { tabWidth: 2, quote: 'single' }).code);
}

function applyBuildConfig(configKey, configObject, override = false) {
  const configFile = './ember-cli-build.js';

  const config = readFileSync(configFile);
  const configAst = recast.parse(config);

  const key = buildKey(configKey);
  const value = buildValue(configObject);

  recast.visit(configAst, {
    // eslint-disable-next-line consistent-return
    visitNewExpression(path) {
      const { node } = path;

      if (node.callee.name === 'EmberApp'
          || node.callee.name === 'EmberAddon') {
        // console.log(node, node.arguments)
        const configNode = node.arguments.find(element => element.type === 'ObjectExpression');

        let configFileObj = configNode.properties.find(
          property => property.key.value === configKey || property.key.name === configKey,
        );

        if (!configFileObj) {
          configFileObj = builders.property(
            'init',
            key,
            value,
          );
          configNode.properties.push(configFileObj);
        } else if (override) {
          configFileObj.value = value;
        }

        return false;
      }

      this.traverse(path);
    },
  });

  writeFileSync(configFile, recast.print(configAst, { tabWidth: 2, quote: 'single' }).code);
}

module.exports = {
  applyConfig,
  applyBuildConfig,
};
