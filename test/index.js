'use strict';

const test = require('ava');
const clutch = require('../index');
const callSignature = require('call-signature');
const {ENHANCED, NOT_ENHANCED} = require('../lib/patterns');

/**
 * Helper method for getting function name from patterns
 * @param {String} signature - function signature to inspect
 */
function methodName(signature) {
  return callSignature.parse(signature).callee.member;
}

test('default api', function(t) {
  const methods = Object.keys(clutch).sort();
  const allPatterns = ENHANCED.concat(NOT_ENHANCED).map(methodName)
    .concat(['default', 'customize']) // add in the default property for modules
    .sort();

  t.deepEqual(methods, allPatterns);
});

test('customize', function(t) {
  const assert = clutch.customize({
    assertion: {
      patterns: [],
    },
  });

  const methods = Object.keys(assert).sort();
  const originalMethods = Object.keys(clutch).sort();

  const simplePatterns = NOT_ENHANCED.map(methodName)
    .concat(['customize'])
    .sort();

  const allPatterns = ENHANCED.concat(NOT_ENHANCED).map(methodName)
    .concat(['default', 'customize']) // add in the default property for modules
    .sort();

  t.deepEqual(methods, simplePatterns);
  t.deepEqual(originalMethods, allPatterns);
});
