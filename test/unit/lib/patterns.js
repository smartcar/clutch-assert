'use strict';

const test = require('ava');
const assert = require('../../lib/assert');
const callSignature = require('call-signature');
const {ENHANCED, NOT_ENHANCED} = require('../../lib/patterns');

test('patterns', function(t) {

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
