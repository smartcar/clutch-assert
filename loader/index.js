'use strict';

const path = require('path');
const helpers = require('./helpers');
const espower = require('espower-loader');
const patterns = require('../lib/patterns');

const parent = path.dirname(module.parent.paths[0]);

var rc;
try { // eslint-disable-next-line global-require
  rc = require(parent + path.sep + '.clutchrc');
} catch (e) {
  // no clutchrc found
}

const dir = helpers.getDirectory(rc);
helpers.checkDirectory(dir);
const pattern = helpers.createPattern(dir);

espower({
  pattern,
  cwd: process.cwd(),
  espowerOptions: {
    patterns: patterns.ENHANCED,
  },
});
