'use strict';

const test = require('ava');
const assert = require('../../lib/assert');

test('.pass()', function(t) {
  t.notThrows(function() {
    assert.pass();
  });
});

test('.fail()', function(t) {
  t.throws(function() {
    assert.fail();
  });
});

test('.truthy()', function(t) {
  t.throws(function() {
    assert.truthy(0);
    assert.truthy(false);
  });

  t.notThrows(function() {
    assert.truthy(1);
    assert.truthy(true);
  });
});

test('.falsy()', function(t) {
  t.throws(function() {
    assert.falsy(1);
    assert.falsy(true);
  });

  t.notThrows(function() {
    assert.falsy(0);
    assert.falsy(false);
  });
});

test('.true()', function(t) {
  t.throws(function() {
    assert.true(1);
  });

  t.throws(function() {
    assert.true(0);
  });

  t.throws(function() {
    assert.true(false);
  });

  t.throws(function() {
    assert.true('foo');
  });

  t.notThrows(function() {
    assert.true(true);
  });
});

test('.false()', function(t) {
  t.throws(function() {
    assert.false(0);
  });

  t.throws(function() {
    assert.false(1);
  });

  t.throws(function() {
    assert.false(true);
  });

  t.throws(function() {
    assert.false('foo');
  });

  t.notThrows(function() {
    assert.false(false);
  });
});

test('.is()', function(t) {
  t.notThrows(function() {
    assert.is('foo', 'foo');
  });

  t.throws(function() {
    assert.is('foo', 'bar');
  });
});

test('.not()', function(t) {
  t.notThrows(function() {
    assert.not('foo', 'bar');
  });

  t.throws(function() {
    assert.not('foo', 'foo');
  });
});

test('.deepEqual()', function(t) {
  // Tests starting here are to detect regressions in the underlying libraries
  // used to test deep object equality

  t.throws(function() {
    assert.deepEqual({a: false}, {a: 0});
  });

  t.notThrows(function() {
    assert.deepEqual({
      a: 'a',
      b: 'b',
    }, {
      b: 'b',
      a: 'a',
    });
  });

  t.notThrows(function() {
    assert.deepEqual({
      a: 'a',
      b: 'b',
      c: {
        d: 'd',
      },
    }, {
      c: {
        d: 'd',
      },
      b: 'b',
      a: 'a',
    });
  });

  t.throws(function() {
    assert.deepEqual([1, 2, 3], [1, 2, 3, 4]);
  });

  t.notThrows(function() {
    assert.deepEqual([1, 2, 3], [1, 2, 3]);
  });

  t.throws(function() {
    assert.deepEqual([1, 2, 3], [1, 2, 3, 4]);
  });

  t.throws(function() {
    var fnA = function(a) {
      return a;
    };
    var fnB = function(a) {
      return a;
    };

    assert.deepEqual(fnA, fnB);
  });

  t.notThrows(function() {
    var x1 = {z: 4};
    var y1 = {x: x1};
    x1.y = y1;

    var x2 = {z: 4};
    var y2 = {x: x2};
    x2.y = y2;

    assert.deepEqual(x1, x2);
  });

  t.notThrows(function() {
    function Foo(a) {
      this.a = a;
    }

    var x = new Foo(1);
    var y = new Foo(1);

    assert.deepEqual(x, y);
  });

  t.notThrows(function() {
    function Foo(a) {
      this.a = a;
    }

    function Bar(a) {
      this.a = a;
    }

    var x = new Foo(1);
    var y = new Bar(1);

    assert.deepEqual(x, y);
  });

  t.throws(function() {
    assert.deepEqual({
      a: 'a',
      b: 'b',
      c: {
        d: false,
      },
    }, {
      c: {
        d: 0,
      },
      b: 'b',
      a: 'a',
    });
  });

  // Regression test end here

  t.notThrows(function() {
    assert.deepEqual({a: 'a'}, {a: 'a'});
  });

  t.notThrows(function() {
    assert.deepEqual(['a', 'b'], ['a', 'b']);
  });

  t.throws(function() {
    assert.deepEqual({a: 'a'}, {a: 'b'});
  });

  t.throws(function() {
    assert.deepEqual(['a', 'b'], ['a', 'a']);
  });

  t.throws(function() {
    assert.deepEqual([['a', 'b'], 'c'], [['a', 'b'], 'd']);
  }, / 'c' ].*? 'd' ]/);

  t.throws(function() {
    var circular = ['a', 'b'];
    circular.push(circular);
    assert.deepEqual([circular, 'c'], [circular, 'd']);
  }, / 'c' ].*? 'd' ]/);
});

test('.notDeepEqual()', function(t) {
  t.notThrows(function() {
    assert.notDeepEqual({a: 'a'}, {a: 'b'});
  });

  t.notThrows(function() {
    assert.notDeepEqual(['a', 'b'], ['c', 'd']);
  });

  t.throws(function() {
    assert.notDeepEqual({a: 'a'}, {a: 'a'});
  });

  t.throws(function() {
    assert.notDeepEqual(['a', 'b'], ['a', 'b']);
  });
});

test('.keys()', function(t) {
  t.notThrows(function() {
    assert.keys({}, []);
  });

  t.notThrows(function() {
    assert.keys({'': 2}, ['']);
  });

  t.notThrows(function() {
    assert.keys({a: 1}, 'a');
  });

  t.notThrows(function() {
    assert.keys({a: 1, b: 2}, ['b', 'a']);
  });

  t.notThrows(function() {
    assert.keys({a: 1, b: {c: 2}}, ['b', 'a']);
  });

  t.throws(function() {
    assert.keys({}, '');
  });

  t.throws(function() {
    assert.keys({a: 1, b: 2}, ['a']);
  });

  t.throws(function() {
    assert.keys({a: 1}, ['a', 'b']);
  });

  t.throws(function() {
    assert.keys({}, 'a');
  });
});

test('.throws()', function(t) {
  t.throws(function() { // eslint-disable-next-line no-empty-function
    assert.throws(function() {});
  });

  t.notThrows(function() {
    assert.throws(function() {
      throw new Error('foo');
    });
  });
});

test('.throws() - Promises', async function(t) {
  await t.notThrows(assert.throws(Promise.reject(new Error('foo'))));
  await t.throws(assert.throws(Promise.resolve()));
});

test('.notThrows() - Promises', async function(t) {
  await t.notThrows(assert.notThrows(Promise.resolve()));
  await t.throws(assert.notThrows(Promise.reject(new Error('foo'))));
});

test('.throws() returns the thrown error', function(t) {
  const expected = new Error();
  const actual = assert.throws(function() {
    throw expected;
  });

  t.is(actual, expected);
});

test('.throws() returns the rejection reason of promise', async function(t) {
  const expected = new Error();

  const actual = await assert.throws(Promise.reject(expected));

  t.is(actual, expected);
});

test('.throws(fn, str) checks that error.message === str', async function(t) {
  const throwFoo = function() {
    throw new Error('foo');
  };

  const rejectFoo = Promise.reject(new Error('foo'));

  t.notThrows(function() { assert.throws(throwFoo, 'foo'); });
  t.throws(function() { assert.throws(throwFoo, 'bar'); });

  await t.notThrows(assert.throws(rejectFoo, 'foo'));
  await t.throws(assert.throws(rejectFoo, 'bar'));
});

test('.throws should throw if passed a bad value', function(t) {
  const err = t.throws(function() {
    assert.throws('not a function');
  });

  t.is(err.name, 'TypeError'); // eslint-disable-next-line max-len
  t.regex(err.message, /t\.throws must be called with a function, Promise, or Observable/);
});

test('.notThrows should throw if passed a bad value', function(t) {
  const err = t.throws(function() {
    assert.notThrows('not a function');
  });

  t.is(err.name, 'TypeError'); // eslint-disable-next-line max-len
  t.regex(err.message, /t\.notThrows must be called with a function, Promise, or Observable/);
});

test('.notThrows()', function(t) {
  t.notThrows(function() { // eslint-disable-next-line no-empty-function
    assert.notThrows(function() {});
  });

  t.throws(function() {
    assert.notThrows(function() {
      throw new Error('foo');
    });
  });
});

test('.regex()', function(t) {
  t.notThrows(function() {
    assert.regex('abc', /^abc$/);
  });

  t.throws(function() {
    assert.regex('foo', /^abc$/);
  });
});

test('.notRegex()', function(t) {
  t.notThrows(function() {
    assert.notRegex('abc', /def/);
  });

  t.throws(function() {
    assert.notRegex('abc', /abc/);
  });
});

test('.ifError()', function(t) {
  t.throws(function() {
    assert.ifError(new Error());
  });

  t.notThrows(function() {
    assert.ifError(null);
  });
});

test('.deepEqual() should not mask RangeError from assert', function(t) {
  function Circular() {
    this.test = this;
  }

  var a = new Circular();
  var b = new Circular();

  t.throws(function() {
    assert.notDeepEqual(a, b);
  });

  t.notThrows(function() {
    assert.deepEqual(a, b);
  });
});
