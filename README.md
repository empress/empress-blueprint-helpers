empress-blueprint-helpers
==============================================================================

This is a small utility that is designed to help implement [Empress](https://github.com/empress) default blueprints that are designed to update host-application configs on first install.

Basic Usage
------------------------------------------------------------------------------

This example is taken from the [Field Guide](https://github.com/empress/field-guide) default blueprint. If you would like to see the example in action you can [view it in the source code](https://github.com/empress/field-guide/blob/e82222eab1e1be4d7ab1552bd185cdc080f2a39b/blueprints/field-guide/index.js#L42)

Here is a simplified example of how to use this utility:

```javascript
const { applyConfig } = require('empress-blueprint-helpers');

module.exports = {
  description: 'Default blueprint for Field Guide',

  afterInstall() {
    applyConfig(this.project, 'field-guide', {
      name: 'Product Name',
      copyright: 'This is the default copyright string - update before publishing',
      github: 'https://github.com/empress/field-guide?update-with-your-repo-url'
    })
  }
};
```

This `afterInstall()` will be run after the first installation of the addon that it is installed in. The above code sample will add the specified JSON object into the `./config/environment.js` file for the host Ember application automatically under the key `field-guide`.


Contributing
------------------------------------------------------------------------------

See the [Contributing](CONTRIBUTING.md) guide for details.


License
------------------------------------------------------------------------------

This project is licensed under the [MIT License](LICENSE.md).
