import test from 'ava';
import callSignature from 'call-signature';

import clutch from '../index';
import {ENHANCED, NOT_ENHANCED} from '../lib/patterns';

/**
 * Helper method for getting function name from patterns
 * @param {String} signature - function signature to inspect
 */
function methodName(signature) {
  return callSignature.parse(signature).callee.member;
}

test('default api', t => {
  const methods = Object.keys(clutch).sort();
  const allPatterns = ENHANCED.concat(NOT_ENHANCED).map(methodName)
    .concat(['default', 'customize']) // add in the default property for modules
    .sort();

  t.deepEqual(methods, allPatterns);
});

test('customize', t => {
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
