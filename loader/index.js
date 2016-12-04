'use strict';

const path = require('path');
const helpers = require('./helpers');
const espower = require('espower-loader');
const patterns = require('../lib/patterns');

const parent = path.dirname(module.parent.paths[0]);

var pkg;
try { // eslint-disable-next-line global-require
  pkg = require(parent + path.sep + 'package.json');
} catch (e) {
  // no package.json found
}

const dir = helpers.getDirectory(pkg);
helpers.checkDirectory(dir);
const pattern = helpers.createPattern(dir);

espower({
  pattern,
  cwd: process.cwd(),
  espowerOptions: {
    patterns: patterns.ENHANCED,
  },
});
