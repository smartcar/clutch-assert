'use strict';

const {AssertionError} = require('assert');
const isPromise = require('is-promise');
const deepEqual = require('not-so-shallow');

const AvaAssertionError = require('./assertion-error');
const {
  formatWithLabel,
  validateExpectations,
  assertExpectations,
} = require('./ava-assert');

const assert = {};

Object.defineProperty(assert, 'AssertionError', {
  value: AssertionError,
});

const noop = () => {}; // eslint-disable-line no-empty-function
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
    throw new AssertionError(opts);
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

// NOTE: do not remove the fn name, it's needed for validateExpectations
assert.throws = function throws(fn, expectations, message) {
  message = message || 'Missing expected exception';

  if (typeof fn !== 'function') {
    throw new AvaAssertionError({
      assertion: assert.throws,
      message: '`assert.throws()` must be called with a function',
      values: [formatWithLabel('Called with:', fn)],
    });
  }

  expectations = validateExpectations(
    assert.throws,
    expectations,
    arguments.length
  );

  let retval;
  let actual;
  let threw = false;

  try {
    retval = fn();
  } catch (error) {
    actual = error;
    threw = true;
  }

  // throw a usage error if promise was returned
  if (isPromise(retval)) {
    // swallow the rejection to prevent unhandled rejection warnings
    retval.catch(noop);
    throw new AvaAssertionError({
      assertion: assert.throws,
      message,
      values: [
        formatWithLabel(
          'Function returned a promise, use `assert.throwsAsync()` instead:',
          retval
        ),
      ],
    });
  }

  if (!threw) {
    throw new AvaAssertionError({
      assertion: assert.throws,
      message,
      values: [formatWithLabel('Function returned:', retval)],
    });
  }

  assertExpectations({
    assertion: assert.throws,
    actual,
    expectations,
    message,
    prefix: 'Function threw',
  });
  return actual;
};

// NOTE: do not remove the fn name, it's needed for validateExpectations
assert.throwsAsync = function throwsAsync(thrower, expectations, message) {
  try {
    message = message || 'Missing expected rejection';

    if (typeof thrower !== 'function' && !isPromise(thrower)) {
      throw new AvaAssertionError({
        assertion: assert.throwsAsync,
        message:
          '`assert.throwsAsync()` must be called with a function or promise',
        values: [formatWithLabel('Called with:', thrower)],
      });
    }

    expectations = validateExpectations(
      assert.throwsAsync,
      expectations,
      arguments.length
    );

    const handlePromise = (promise, wasReturned) => {
      const label = wasReturned ? 'Returned promise' : 'Promise';
      return promise.then(
        (value) => {
          throw new AvaAssertionError({
            assertion: assert.throwsAsync,
            message,
            values: [formatWithLabel(`${label} resolved with:`, value)],
          });
        },
        (reason) => {
          assertExpectations({
            assertion: assert.throwsAsync,
            actual: reason,
            expectations,
            message,
            prefix: `${label} rejected with`,
          });
          return reason;
        }
      );
    };

    if (isPromise(thrower)) {
      return handlePromise(thrower, false);
    }

    let retval;
    let threw = false;
    try {
      retval = thrower();
    } catch (error) {
      retval = error;
      threw = true;
    }

    if (!isPromise(retval)) {
      const action = threw ? 'threw' : 'returned';

      throw new AvaAssertionError({
        assertion: assert.throwsAsync,
        // eslint-disable-next-line max-len
        message: `Function ${action} synchronously, use \`assert.throws()\` instead:`,
        values: [formatWithLabel(`Function ${action}:`, retval)],
      });
    }

    return handlePromise(retval, true);
  } catch (err) {
    return Promise.reject(err);
  }
};

assert.notThrows = function(fn, message) {
  message = message || 'Got unwanted exception';

  if (typeof fn !== 'function') {
    throw new AvaAssertionError({
      assertion: assert.notThrows,
      message: '`assert.notThrows()` must be called with a function',
      values: [formatWithLabel('Called with:', fn)],
    });
  }

  let retval;
  try {
    retval = fn();
  } catch (error) {
    throw new AvaAssertionError({
      assertion: assert.notThrows,
      message,
      values: [formatWithLabel('Function threw:', error)],
    });
  }

  if (isPromise(retval)) {
    // swallow the rejection to prevent unhandled rejection warnings
    retval.catch(noop);
    throw new AvaAssertionError({
      assertion: assert.notThrows,
      message,
      values: [
        formatWithLabel(
          'Function returned a promise, use `assert.notThrowsAsync()` instead:',
          retval
        ),
      ],
    });
  }
};

assert.notThrowsAsync = function(nonThrower, message) {
  message = message || 'Got unwanted rejection';

  try {
    if (typeof nonThrower !== 'function' && !isPromise(nonThrower)) {
      throw new AvaAssertionError({
        assertion: assert.notThrowsAsync,
        message:
          '`assert.notThrowsAsync()` must be called with a function or promise',
        values: [formatWithLabel('Called with:', nonThrower)],
      });
    }

    const handlePromise = (promise, wasReturned) => {
      return promise.catch(function(reason) {
        const label = wasReturned ? 'Returned promise' : 'Promise';
        throw new AvaAssertionError({
          assertion: assert.notThrowsAsync,
          message,
          values: [formatWithLabel(`${label} rejected with:`, reason)],
        });
      });
    };

    if (isPromise(nonThrower)) {
      return handlePromise(nonThrower, false);
    }

    let retval;
    let threw = false;
    try {
      retval = nonThrower();
    } catch (error) {
      threw = true;
      retval = error;
    }

    if (!isPromise(retval)) {
      const action = threw ? 'threw' : 'returned';

      throw new AvaAssertionError({
        assertion: assert.notThrowsAsync,
        // eslint-disable-next-line max-len
        message: `Function ${action} synchronously, use \`assert.notThrows()\` instead:`,
        values: [formatWithLabel(`Function ${action}:`, retval)],
      });
    }

    return handlePromise(retval, true);
  } catch (err) {
    return Promise.reject(err);
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
