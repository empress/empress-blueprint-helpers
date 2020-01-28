const recast = require('recast');
const { readFileSync, writeFileSync } = require('fs');

const { builders } = recast.types;

function applyConfig(project, configKey, configObject) {
  let configFile = './config/environment.js';

  if (project.isEmberCLIAddon()) {
    configFile = './tests/dummy/config/environment.js';
  }

  const config = readFileSync(configFile);
  const configAst = recast.parse(config);

  const key = configKey.includes('-') ? builders.literal(configKey) : builders.identifier(configKey);

  let value;

  if (typeof configObject === 'object') {
    // eslint-disable-next-line arrow-body-style
    value = builders.objectExpression(Object.keys(configObject).map((objKey) => {
      return builders.property('init', builders.identifier(objKey), builders.literal(configObject[objKey]));
    }));
  } else {
    value = builders.literal(configObject);
  }


  recast.visit(configAst, {
    // eslint-disable-next-line consistent-return
    visitVariableDeclaration(path) {
      const { node } = path;

      const env = node.declarations.find(declaration => declaration.id.name === 'ENV');

      if (env) {
        let configObj = env.init.properties.find(property => property.key.value === configKey);

        if (!configObj) {
          configObj = builders.property(
            'init',
            key,
            value,
          );
          env.init.properties.push(configObj);
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
};
