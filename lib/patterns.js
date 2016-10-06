'use strict';

module.exports.ENHANCED = [
  't.truthy(value, [message])',
  't.falsy(value, [message])',
  't.true(value, [message])',
  't.false(value, [message])',
  't.is(value, expected, [message])',
  't.not(value, expected, [message])',
  't.deepEqual(value, expected, [message])',
  't.notDeepEqual(value, expected, [message])',
  't.regex(contents, regex, [message])',
  't.notRegex(contents, regex, [message])',
];

module.exports.NOT_ENHANCED = [
  't.pass([message])',
  't.fail([message])',
  't.throws(fn, [message])',
  't.notThrows(fn, [message])',
  't.ifError(error, [message])',
];
