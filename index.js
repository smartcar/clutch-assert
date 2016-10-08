'use strict';

const empower = require('empower');
const formatter = require('power-assert-formatter');

const assert = require('./lib/assert');
const patterns = require('./lib/patterns');

const empowerOptions = {
  modifyMessageOnRethrow: true,
  saveContextOnRethrow: true,
  patterns: patterns.ENHANCED,
  wrapOnlyPatterns: patterns.NOT_ENHANCED,
};

function customize(options) {
  options = options || {};

  const powered = empower(
    assert,
    formatter(options.output),
    Object.assign(empowerOptions, options.assertion)
  );
  powered.customize = customize;

  return powered;
}

const clutch = customize();

clutch.default = clutch;
module.exports = clutch;
