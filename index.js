const empower = require('empower');
const formatter = require('power-assert-formatter');

const assert = require('./lib/assert');
const patterns = require('./lib/patterns');

const empowerOptions = {
  modifyMessageOnRethrow: true,
  saveContextOnRethrow: true,
  patterns: patterns.ENHANCED,
};

function customize(customOptions) {
  const options = customOptions || {};
  const poweredAssert = empower(
    assert,
    formatter(options.output),
    Object.assign(empowerOptions, options.assertion)
  );
  poweredAssert.customize = customize;
  return poweredAssert;
}

const clutch = customize();

clutch.default = clutch;
module.exports = clutch;
