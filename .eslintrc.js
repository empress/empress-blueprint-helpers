module.exports = {
  env: {
    node: true,
  },
  extends: 'airbnb-base',
  overrides: [
    {
      files: [
        'test/**/*.js',
      ],
      env: {
        mocha: true,
      },
      rules: {
        'func-names': 0,
        'prefer-arrow-callback': 0,
      },
    },
  ],
};
