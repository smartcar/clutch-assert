import test from 'ava';
import assert from '../lib/assert';

test('.pass()', t => {
  t.notThrows(() => {
    assert.pass();
  });
});

test('.fail()', t => {
  t.throws(() => {
    assert.fail();
  });
});

test('.truthy()', t => {
  t.throws(() => {
    assert.truthy(0);
    assert.truthy(false);
  });

  t.notThrows(() => {
    assert.truthy(1);
    assert.truthy(true);
  });
});

test('.falsy()', t => {
  t.throws(() => {
    assert.falsy(1);
    assert.falsy(true);
  });

  t.notThrows(() => {
    assert.falsy(0);
    assert.falsy(false);
  });
});

test('.true()', t => {
  t.throws(() => {
    assert.true(1);
  });

  t.throws(() => {
    assert.true(0);
  });

  t.throws(() => {
    assert.true(false);
  });

  t.throws(() => {
    assert.true('foo');
  });

  t.notThrows(() => {
    assert.true(true);
  });
});

test('.false()', t => {
  t.throws(() => {
    assert.false(0);
  });

  t.throws(() => {
    assert.false(1);
  });

  t.throws(() => {
    assert.false(true);
  });

  t.throws(() => {
    assert.false('foo');
  });

  t.notThrows(() => {
    assert.false(false);
  });
});

test('.is()', t => {
  t.notThrows(() => {
    assert.is('foo', 'foo');
  });

  t.throws(() => {
    assert.is('foo', 'bar');
  });
});

test('.not()', t => {
  t.notThrows(() => {
    assert.not('foo', 'bar');
  });

  t.throws(() => {
    assert.not('foo', 'foo');
  });
});

test('.deepEqual()', t => {
  // Tests starting here are to detect regressions in the underlying libraries
  // used to test deep object equality

  t.throws(() => {
    assert.deepEqual({a: false}, {a: 0});
  });

  t.notThrows(() => {
    assert.deepEqual({
      a: 'a',
      b: 'b',
    }, {
      b: 'b',
      a: 'a',
    });
  });

  t.notThrows(() => {
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

  t.throws(() => {
    assert.deepEqual([1, 2, 3], [1, 2, 3, 4]);
  });

  t.notThrows(() => {
    assert.deepEqual([1, 2, 3], [1, 2, 3]);
  });

  t.throws(() => {
    assert.deepEqual([1, 2, 3], [1, 2, 3, 4]);
  });

  t.throws(() => {
    var fnA = function(a) {
      return a;
    };
    var fnB = function(a) {
      return a;
    };

    assert.deepEqual(fnA, fnB);
  });

  t.notThrows(() => {
    var x1 = {z: 4};
    var y1 = {x: x1};
    x1.y = y1;

    var x2 = {z: 4};
    var y2 = {x: x2};
    x2.y = y2;

    assert.deepEqual(x1, x2);
  });

  t.notThrows(() => {
    function Foo(a) {
      this.a = a;
    }

    var x = new Foo(1);
    var y = new Foo(1);

    assert.deepEqual(x, y);
  });

  t.notThrows(() => {
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

  t.throws(() => {
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

  t.notThrows(() => {
    assert.deepEqual({a: 'a'}, {a: 'a'});
  });

  t.notThrows(() => {
    assert.deepEqual(['a', 'b'], ['a', 'b']);
  });

  t.throws(() => {
    assert.deepEqual({a: 'a'}, {a: 'b'});
  });

  t.throws(() => {
    assert.deepEqual(['a', 'b'], ['a', 'a']);
  });

  t.throws(() => {
    assert.deepEqual([['a', 'b'], 'c'], [['a', 'b'], 'd']);
  }, / 'c' ].*? 'd' ]/);

  t.throws(() => {
    var circular = ['a', 'b'];
    circular.push(circular);
    assert.deepEqual([circular, 'c'], [circular, 'd']);
  }, / 'c' ].*? 'd' ]/);
});

test('.notDeepEqual()', t => {
  t.notThrows(() => {
    assert.notDeepEqual({a: 'a'}, {a: 'b'});
  });

  t.notThrows(() => {
    assert.notDeepEqual(['a', 'b'], ['c', 'd']);
  });

  t.throws(() => {
    assert.notDeepEqual({a: 'a'}, {a: 'a'});
  });

  t.throws(() => {
    assert.notDeepEqual(['a', 'b'], ['a', 'b']);
  });
});

test('.keys()', t => {
  t.notThrows(() => {
    assert.keys({}, []);
  });

  t.notThrows(() => {
    assert.keys({'': 2}, ['']);
  });

  t.notThrows(() => {
    assert.keys({a: 1}, 'a');
  });

  t.notThrows(() => {
    assert.keys({a: 1, b: 2}, ['b', 'a']);
  });

  t.notThrows(() => {
    assert.keys({a: 1, b: {c: 2}}, ['b', 'a']);
  });

  t.throws(() => {
    assert.keys({}, '');
  });

  t.throws(() => {
    assert.keys({a: 1, b: 2}, ['a']);
  });

  t.throws(() => {
    assert.keys({a: 1}, ['a', 'b']);
  });

  t.throws(() => {
    assert.keys({}, 'a');
  });
});

test('.throws()', t => {
  t.throws(() => { // eslint-disable-next-line no-empty-function
    assert.throws(() => {});
  });

  t.notThrows(() => {
    assert.throws(() => {
      throw new Error('foo');
    });
  });
});

test('.throws() - Promises', t => {
  t.notThrows(assert.throws(Promise.reject(new Error('foo'))));

  t.throws(assert.throws(Promise.resolve()));
});

test('.notThrows() - Promises', t => {
  t.notThrows(assert.notThrows(Promise.resolve()));

  t.throws(assert.notThrows(Promise.reject(new Error('foo'))));
});

test('.throws() returns the thrown error', t => {
  const expected = new Error();
  const actual = assert.throws(() => {
    throw expected;
  });

  t.is(actual, expected);
});

test('.throws() returns the rejection reason of promise', async t => {
  const expected = new Error();

  const actual = await assert.throws(Promise.reject(expected));

  t.is(actual, expected);
});

test('.throws(fn, str) checks that error.message === str', t => {
  const throwFoo = () => {
    throw new Error('foo');
  };

  const rejectFoo = Promise.reject(new Error('foo'));

  t.notThrows(() => assert.throws(throwFoo, 'foo'));
  t.throws(() => assert.throws(throwFoo, 'bar'));

  t.notThrows(assert.throws(rejectFoo, 'foo'));
  t.throws(assert.throws(rejectFoo, 'bar'));
});

test('.throws should throw if passed a bad value', t => {
  const err = t.throws(() => {
    assert.throws('not a function');
  });

  t.is(err.name, 'TypeError'); // eslint-disable-next-line max-len
  t.regex(err.message, /t\.throws must be called with a function, Promise, or Observable/);
});

test('.notThrows should throw if passed a bad value', t => {
  const err = t.throws(() => {
    assert.notThrows('not a function');
  });

  t.is(err.name, 'TypeError'); // eslint-disable-next-line max-len
  t.regex(err.message, /t\.notThrows must be called with a function, Promise, or Observable/);
});

test('.notThrows()', t => {
  t.notThrows(() => { // eslint-disable-next-line no-empty-function
    assert.notThrows(() => {});
  });

  t.throws(() => {
    assert.notThrows(() => {
      throw new Error('foo');
    });
  });
});

test('.regex()', t => {
  t.notThrows(() => {
    assert.regex('abc', /^abc$/);
  });

  t.throws(() => {
    assert.regex('foo', /^abc$/);
  });
});

test('.notRegex()', t => {
  t.notThrows(() => {
    assert.notRegex('abc', /def/);
  });

  t.throws(() => {
    assert.notRegex('abc', /abc/);
  });
});

test('.ifError()', t => {
  t.throws(() => {
    assert.ifError(new Error());
  });

  t.notThrows(() => {
    assert.ifError(null);
  });
});

test('.deepEqual() should not mask RangeError from underlying assert', t => {
  function Circular() {
    this.test = this;
  }

  var a = new Circular();
  var b = new Circular();

  t.throws(() => {
    assert.notDeepEqual(a, b);
  });

  t.notThrows(() => {
    assert.deepEqual(a, b);
  });
});
