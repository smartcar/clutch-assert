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

function Clutch(options) {
  options = options || {};

  const poweredAssert = empower(
    assert,
    formatter(options.output),
    Object.assign(empowerOptions, options.assertion)
  );

  Object.assign(this, poweredAssert);
}

Clutch.prototype.customize = function(options) {
  return new Clutch(options);
};

const clutch = new Clutch();

clutch.default = clutch;
module.exports = clutch;
