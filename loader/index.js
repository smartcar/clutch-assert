'use strict';

const fs = require('fs');
const path = require('path');
const helpers = require('./helpers');
const espower = require('espower-loader');
const patterns = require('../lib/patterns');

const parent = helpers.findParent(module.paths);

var rc;
try {
  rc = JSON.parse(fs.readFileSync(parent + path.sep + '.clutchrc'));
} catch (e) {

  if (e.code !== 'ENOENT') {
    throw e;
  }

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
