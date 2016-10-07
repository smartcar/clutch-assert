'use strict';

module.exports.ENHANCED = [
  'assert.truthy(value, [message])',
  'assert.falsy(value, [message])',
  'assert.true(value, [message])',
  'assert.false(value, [message])',
  'assert.is(value, expected, [message])',
  'assert.not(value, expected, [message])',
  'assert.deepEqual(value, expected, [message])',
  'assert.notDeepEqual(value, expected, [message])',
  'assert.regex(contents, regex, [message])',
  'assert.notRegex(contents, regex, [message])',
  'assert.keys(object, keys, [message])',
];

module.exports.NOT_ENHANCED = [
  'assert.pass([message])',
  'assert.fail([message])',
  'assert.throws(fn, [message])',
  'assert.notThrows(fn, [message])',
  'assert.ifError(error, [message])',
];
