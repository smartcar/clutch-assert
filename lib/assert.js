'use strict';

const nodeAssert = require('assert');
const isPromise = require('is-promise');
const deepEqual = require('not-so-shallow');
const isObservable = require('is-observable');
const observableToPromise = require('observable-to-promise');

const assert = {};

Object.defineProperty(assert, 'AssertionError', {
  value: nodeAssert.AssertionError,
});

function create(actual, expected, operator, message, fn) {
  return {
    actual,
    expected,
    message,
    operator,
    stackStartFunction: fn,
  };
}

function test(ok, opts) {
  if (!ok) {
    throw new nodeAssert.AssertionError(opts);
  }
}

assert.pass = function(msg) {
  test(true, create(true, true, 'pass', msg, assert.pass));
};

assert.fail = function(msg) {
  msg = msg || 'Test failed via assert.fail()';
  test(false, create(false, false, 'fail', msg, assert.fail));
};

assert.truthy = function(val, msg) {
  test(val, create(val, true, '==', msg, assert.truthy));
};

assert.falsy = function(val, msg) {
  test(!val, create(val, false, '==', msg, assert.falsy));
};

assert.true = function(val, msg) {
  test(val === true, create(val, true, '===', msg, assert.true));
};

assert.false = function(val, msg) {
  test(val === false, create(val, false, '===', msg, assert.false));
};

assert.is = function(val, expected, msg) {
  test(val === expected, create(val, expected, '===', msg, assert.is));
};

assert.not = function(val, expected, msg) {
  test(val !== expected, create(val, expected, '!==', msg, assert.not));
};

assert.deepEqual = function(val, expected, msg) {
  const res = deepEqual(val, expected);
  test(res, create(val, expected, '===', msg, assert.deepEqual));
};

assert.notDeepEqual = function(val, expected, msg) {
  const res = !deepEqual(val, expected);
  test(res, create(val, expected, '!==', msg, assert.notDeepEqual));
};

assert.keys = function(object, expected, msg) {
  // Sort the arrays first so the diff that assert displays is cleaner
  expected = typeof expected === 'string' ? [expected] : expected.sort();

  const actual = Object.keys(object).sort();
  const options = create(actual, expected, '===', msg, assert.keys);

  test(deepEqual(actual, expected), options);
};

assert.throws = function(fn, err, msg) {
  if (isObservable(fn)) {
    fn = observableToPromise(fn);
  }

  if (isPromise(fn)) {
    return fn
      .then(function() {
        assert.throws(function() {
          // noop
        }, err, msg);
      }, function(fnErr) {
        return assert.throws(function() {
          throw fnErr;
        }, err, msg);
      });
  }

  if (typeof fn !== 'function') { // eslint-disable-next-line max-len
    throw new TypeError('assert.throws must be called with a function, Promise, or Observable');
  }

  try {
    if (typeof err === 'string') {
      var errMsg = err;
      err = function(err) {
        return err.message === errMsg;
      };
    }

    var result;

    nodeAssert.throws(function() {
      try {
        fn();
      } catch (err) {
        result = err;
        throw err;
      }
    }, err, msg);

    return result;
  } catch (err) { // eslint-disable-next-line max-len
    test(false, create(err.actual, err.expected, err.operator, err.message, assert.throws));
  }
};

assert.notThrows = function(fn, msg) {
  if (isObservable(fn)) {
    fn = observableToPromise(fn);
  }

  if (isPromise(fn)) {
    return fn
      .catch(function(err) {
        assert.notThrows(function() {
          throw err;
        }, msg);
      });
  }

  if (typeof fn !== 'function') { // eslint-disable-next-line max-len
    throw new TypeError('assert.notThrows must be called with a function, Promise, or Observable');
  }

  try {
    nodeAssert.doesNotThrow(fn, msg);
  } catch (err) { // eslint-disable-next-line max-len
    test(false, create(err.actual, err.expected, err.operator, err.message, assert.notThrows));
  }
};

assert.regex = function(contents, regex, msg) {
  test(regex.test(contents), create(regex, contents, '===', msg, assert.regex));
};

assert.notRegex = function(contents, regex, msg) {
  const res = !regex.test(contents);
  test(res, create(regex, contents, '!==', msg, assert.notRegex));
};

assert.ifError = function(err, msg) {
  test(!err, create(err, 'Error', '!==', msg, assert.ifError));
};

module.exports = assert;
