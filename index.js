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
            configKey.includes('-') ? builders.literal(configKey) : builders.identifier(configKey),
            // eslint-disable-next-line arrow-body-style
            builders.objectExpression(Object.keys(configObject).map((key) => {
              return builders.property('init', builders.identifier(key), builders.literal(configObject[key]));
            })),
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
