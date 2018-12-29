'use strict';

const {inherits} = require('util');
const {AssertionError} = require('assert');

const formatSerializedError = require('./format-serialized-error');

/**
 * Takes AVA's AssertionError spec and converts into a message for printing
 *
 * @param {Object} spec - ava assertion spec
 */
function AvaAssertionError(spec) {
  spec.message = AvaAssertionError.buildMessage(spec);
  throw new AssertionError(spec);
}
inherits(AvaAssertionError, AssertionError);

AvaAssertionError.buildMessage = function(spec) {
  const serialized = formatSerializedError(spec);
  let message = '';

  if (serialized.printMessage && spec.message) {
    message += spec.message;
  }

  message += '\x1b[0m\n\n';
  message += serialized.formatted + '\n';
  return message;
};

module.exports = AvaAssertionError;
