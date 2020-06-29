'use strict';

module.exports = {
  opts: {
    destination: './jsdoc',
    recurse: true,
    readme: 'README.md',
  },
  plugins: ['plugins/markdown'],
  source: {
    excludePattern: 'test|node_modules|coverage|jsdoc',
  },
  templates: {
    monospaceLinks: true,
    default: {
      includeDate: false,
      useLongnameInNav: true,
    },
  },
};
