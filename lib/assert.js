'use strict';

const assert = require('assert');
const isPromise = require('is-promise');
const deepEqual = require('not-so-shallow');
const isObservable = require('is-observable');
const observableToPromise = require('observable-to-promise');

var x = module.exports;

Object.defineProperty(x, 'AssertionError', {value: assert.AssertionError});

function create(val, expected, operator, msg, fn) {
  return {
    actual: val,
    expected: expected,
    message: msg,
    operator: operator,
    stackStartFunction: fn,
  };
}

function test(ok, opts) {
  if (!ok) {
    throw new assert.AssertionError(opts);
  }
}

x.pass = function(msg) {
  test(true, create(true, true, 'pass', msg, x.pass));
};

x.fail = function(msg) {
  msg = msg || 'Test failed via t.fail()';
  test(false, create(false, false, 'fail', msg, x.fail));
};

x.truthy = function(val, msg) {
  test(val, create(val, true, '==', msg, x.truthy));
};

x.falsy = function(val, msg) {
  test(!val, create(val, false, '==', msg, x.falsy));
};

x.true = function(val, msg) {
  test(val === true, create(val, true, '===', msg, x.true));
};

x.false = function(val, msg) {
  test(val === false, create(val, false, '===', msg, x.false));
};

x.is = function(val, expected, msg) {
  test(val === expected, create(val, expected, '===', msg, x.is));
};

x.not = function(val, expected, msg) {
  test(val !== expected, create(val, expected, '!==', msg, x.not));
};

x.deepEqual = function(val, expected, msg) {
  const res = !deepEqual(val, expected);
  test(res, create(val, expected, '===', msg, x.deepEqual));
};

x.notDeepEqual = function(val, expected, msg) {
  const res = !deepEqual(val, expected);
  test(res, create(val, expected, '!==', msg, x.notDeepEqual));
};

x.throws = function(fn, err, msg) {
  if (isObservable(fn)) {
    fn = observableToPromise(fn);
  }

  if (isPromise(fn)) {
    return fn
      .then(function() {
        x.throws(function() {
          // noop
        }, err, msg);
      }, function(fnErr) {
        return x.throws(function() {
          throw fnErr;
        }, err, msg);
      });
  }

  if (typeof fn !== 'function') { // eslint-disable-next-line max-len
    throw new TypeError('t.throws must be called with a function, Promise, or Observable');
  }

  try {
    if (typeof err === 'string') {
      var errMsg = err;
      err = function(err) {
        return err.message === errMsg;
      };
    }

    var result;

    assert.throws(function() {
      try {
        fn();
      } catch (err) {
        result = err;
        throw err;
      }
    }, err, msg);

    return result;
  } catch (err) { // eslint-disable-next-line max-len
    test(false, create(err.actual, err.expected, err.operator, err.message, x.throws));
  }
};

x.notThrows = function(fn, msg) {
  if (isObservable(fn)) {
    fn = observableToPromise(fn);
  }

  if (isPromise(fn)) {
    return fn
      .catch(function(err) {
        x.notThrows(function() {
          throw err;
        }, msg);
      });
  }

  if (typeof fn !== 'function') { // eslint-disable-next-line max-len
    throw new TypeError('t.notThrows must be called with a function, Promise, or Observable');
  }

  try {
    assert.doesNotThrow(fn, msg);
  } catch (err) { // eslint-disable-next-line max-len
    test(false, create(err.actual, err.expected, err.operator, err.message, x.notThrows));
  }
};

x.regex = function(contents, regex, msg) {
  test(regex.test(contents), create(regex, contents, '===', msg, x.regex));
};

x.notRegex = function(contents, regex, msg) {
  test(!regex.test(contents), create(regex, contents, '!==', msg, x.notRegex));
};

x.ifError = x.error = function(err, msg) {
  test(!err, create(err, 'Error', '!==', msg, x.ifError));
};
