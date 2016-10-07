import test from 'ava';
import callSignature from 'call-signature';

import assert from '../lib/assert';
import {ENHANCED, NOT_ENHANCED} from '../lib/patterns';

test('patterns', t => {

  // Validates that our power-assert patterns match the API
  function methodName(signature) {
    var parsed = callSignature.parse(signature);
    t.is(parsed.callee.object, 'assert');
    return parsed.callee.member;
  }

  const allPatterns = ENHANCED.map(methodName)
    .concat(NOT_ENHANCED.map(methodName)).sort();

  const allMethods = Object.keys(assert).sort();

  t.deepEqual(allMethods, allPatterns);

});
