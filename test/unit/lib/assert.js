'use strict';

const test = require('ava');

const assert = require('../../../lib/assert');

test('.pass()', function (t) {
  t.notThrows(function () {
    assert.pass();
  });
});

test('.fail()', function (t) {
  t.throws(function () {
    assert.fail();
  });
});

test('.truthy()', function (t) {
  t.throws(function () {
    assert.truthy(0);
    assert.truthy(false);
  });

  t.notThrows(function () {
    assert.truthy(1);
    assert.truthy(true);
  });
});

test('.falsy()', function (t) {
  t.throws(function () {
    assert.falsy(1);
    assert.falsy(true);
  });

  t.notThrows(function () {
    assert.falsy(0);
    assert.falsy(false);
  });
});

test('.true()', function (t) {
  t.throws(function () {
    assert.true(1);
  });

  t.throws(function () {
    assert.true(0);
  });

  t.throws(function () {
    assert.true(false);
  });

  t.throws(function () {
    assert.true('foo');
  });

  t.notThrows(function () {
    assert.true(true);
  });
});

test('.false()', function (t) {
  t.throws(function () {
    assert.false(0);
  });

  t.throws(function () {
    assert.false(1);
  });

  t.throws(function () {
    assert.false(true);
  });

  t.throws(function () {
    assert.false('foo');
  });

  t.notThrows(function () {
    assert.false(false);
  });
});

test('.is()', function (t) {
  t.notThrows(function () {
    assert.is('foo', 'foo');
  });

  t.throws(function () {
    assert.is('foo', 'bar');
  });
});

test('.not()', function (t) {
  t.notThrows(function () {
    assert.not('foo', 'bar');
  });

  t.throws(function () {
    assert.not('foo', 'foo');
  });
});

test('.deepEqual()', function (t) {
  // Tests starting here are to detect regressions in the underlying libraries
  // used to test deep object equality

  t.throws(function () {
    assert.deepEqual({ a: false }, { a: 0 });
  });

  t.notThrows(function () {
    assert.deepEqual(
      {
        a: 'a',
        b: 'b',
      },
      {
        b: 'b',
        a: 'a',
      },
    );
  });

  t.notThrows(function () {
    assert.deepEqual(
      {
        a: 'a',
        b: 'b',
        c: {
          d: 'd',
        },
      },
      {
        c: {
          d: 'd',
        },
        b: 'b',
        a: 'a',
      },
    );
  });

  t.throws(function () {
    assert.deepEqual([1, 2, 3], [1, 2, 3, 4]);
  });

  t.notThrows(function () {
    assert.deepEqual([1, 2, 3], [1, 2, 3]);
  });

  t.throws(function () {
    assert.deepEqual([1, 2, 3], [1, 2, 3, 4]);
  });

  t.throws(function () {
    const fnA = function (a) {
      return a;
    };
    const fnB = function (a) {
      return a;
    };

    assert.deepEqual(fnA, fnB);
  });

  t.notThrows(function () {
    const x1 = { z: 4 };
    const y1 = { x: x1 };
    x1.y = y1;

    const x2 = { z: 4 };
    const y2 = { x: x2 };
    x2.y = y2;

    assert.deepEqual(x1, x2);
  });

  t.notThrows(function () {
    function Foo(a) {
      this.a = a;
    }

    const x = new Foo(1);
    const y = new Foo(1);

    assert.deepEqual(x, y);
  });

  t.throws(function () {
    function Foo(a) {
      this.a = a;
    }

    function Bar(a) {
      this.a = a;
    }

    const x = new Foo(1);
    const y = new Bar(1);

    assert.deepEqual(x, y);
  });

  t.throws(function () {
    assert.deepEqual(
      {
        a: 'a',
        b: 'b',
        c: {
          d: false,
        },
      },
      {
        c: {
          d: 0,
        },
        b: 'b',
        a: 'a',
      },
    );
  });

  t.throws(function() {
    assert.deepEqual({a: 1}, {a: 1, b: undefined});
  });

  t.throws(function() {
    assert.deepEqual(new Date('1972-08-01'), null);
  });

  t.throws(function() {
    assert.deepEqual(new Date('1972-08-01'), undefined);
  });

  t.notThrows(function() {
    assert.deepEqual(new Date('1972-08-01'), new Date('1972-08-01'));
  });

  t.notThrows(function() {
    assert.deepEqual(
      {x: new Date('1972-08-01')},
      {x: new Date('1972-08-01')},
    );
  });

  t.throws(function() {
    assert.deepEqual(
      function a() { /* empty */ },
      function a() { /* empty */ },
    );
  });

  t.notThrows(function() {
    assert.deepEqual(undefined, undefined);
    assert.deepEqual({x: undefined}, {x: undefined});
    assert.deepEqual({x: [undefined]}, {x: [undefined]});
  });

  t.notThrows(function() {
    assert.deepEqual(null, null);
    assert.deepEqual({x: null}, {x: null});
    assert.deepEqual({x: [null]}, {x: [null]});
  });

  t.notThrows(function() {
    assert.deepEqual(0, 0);
    assert.deepEqual(1, 1);
    assert.deepEqual(3.14, 3.14);
  });

  t.throws(function() {
    assert.deepEqual(0, 1);
  });

  t.throws(function() {
    assert.deepEqual(1, -1);
  });

  t.throws(function() {
    assert.deepEqual(3.14, 2.72);
  });

  t.throws(function() {
    assert.deepEqual({0: 'a', 1: 'b'}, ['a', 'b']);
  });

  t.notThrows(function() {
    assert.deepEqual(
      [
        {foo: {z: 100, y: 200, x: 300}},
        'bar',
        11,
        {baz: {d: 4, a: 1, b: 2, c: 3}},
      ],
      [
        {foo: {x: 300, y: 200, z: 100}},
        'bar',
        11,
        {baz: {c: 3, b: 2, a: 1, d: 4}},
      ],
    );
  });

  t.notThrows(function() {
    assert.deepEqual(
      {x: {a: 1, b: 2}, y: {c: 3, d: 4}},
      {y: {d: 4, c: 3}, x: {b: 2, a: 1}},
    );
  });

  // Regression test end here

  t.notThrows(function () {
    assert.deepEqual({ a: 'a' }, { a: 'a' });
  });

  t.notThrows(function () {
    assert.deepEqual(['a', 'b'], ['a', 'b']);
  });

  t.throws(function () {
    assert.deepEqual({ a: 'a' }, { a: 'b' });
  });

  t.throws(function () {
    assert.deepEqual(['a', 'b'], ['a', 'a']);
  });

  let err, msg;

  err = t.throws(function () {
    assert.deepEqual([['a', 'b'], 'c'], [['a', 'b'], 'd']);
  });
  msg = err.message.replace(/\n/g, '');
  t.regex(msg, /'c'\s*].*?'d'\s*]/);

  err = t.throws(function () {
    const circular = ['a', 'b'];
    circular.push(circular);
    assert.deepEqual([circular, 'c'], [circular, 'd']);
  });

  msg = err.message.replace(/\n/g, '');
  t.regex(msg, /'c'\s*].*?'d'\s*]/);
});

test('.notDeepEqual()', function (t) {
  t.notThrows(function () {
    assert.notDeepEqual({ a: 'a' }, { a: 'b' });
  });

  t.notThrows(function () {
    assert.notDeepEqual(['a', 'b'], ['c', 'd']);
  });

  t.throws(function () {
    assert.notDeepEqual({ a: 'a' }, { a: 'a' });
  });

  t.throws(function () {
    assert.notDeepEqual(['a', 'b'], ['a', 'b']);
  });
});

test('.keys()', function (t) {
  t.notThrows(function () {
    assert.keys({}, []);
  });

  t.notThrows(function () {
    assert.keys({ '': 2 }, ['']);
  });

  t.notThrows(function () {
    assert.keys({ a: 1 }, 'a');
  });

  t.notThrows(function () {
    assert.keys({ a: 1, b: 2 }, ['b', 'a']);
  });

  t.notThrows(function () {
    assert.keys({ a: 1, b: { c: 2 } }, ['b', 'a']);
  });

  t.throws(function () {
    assert.keys({}, '');
  });

  t.throws(function () {
    assert.keys({ a: 1, b: 2 }, ['a']);
  });

  t.throws(function () {
    assert.keys({ a: 1 }, ['a', 'b']);
  });

  t.throws(function () {
    assert.keys({}, 'a');
  });
});

test('.throws - error - non function arguments', function (t) {
  t.throws(() => assert.throws(null), {
    message: /^`assert.throws\(\)` must be called with a function/,
  });

  t.throws(() => assert.throws(Promise.resolve()), {
    message: /^`assert.throws\(\)` must be called with a function/,
  });
});

test('.throws - error - invalid assertion', function (t) {
  const assertion = { pizza: 'not a valid key' };
  t.throws(() => assert.throws(() => 'hi', assertion), {
    message: /^The second argument to `assert.throws\(\)` contains unexpected/,
  });
});

test('.throws - error - asynchronous resolution', function (t) {
  const resolver = () => Promise.resolve();

  t.throws(() => assert.throws(resolver), {
    message: /Function returned a promise, use `assert.throwsAsync\(\)` instead/,
  });
});

test('.throws - error - asynchronous rejection', function (t) {
  const rejecter = () => Promise.reject(new Error('typos!'));
  t.throws(() => assert.throws(rejecter), {
    message: /Function returned a promise, use `assert.throwsAsync\(\)` instead/,
  });
});

test('.throws - error - no error thrown - default message', function (t) {
  t.throws(() => assert.throws(() => 'hello there'), {
    message: /^Missing expected exception[^]*Function returned/,
  });
});

test('.throws - error - no error thrown - custom message', function (t) {
  t.throws(
    () => assert.throws(() => 'hello there', null, 'this is my custom message'),
    {
      message: /^this is my custom message[^]*Function returned/,
    },
  );
});

test('.throws - error - string message does not match', function (t) {
  const expected = new Error('message');
  t.throws(
    () => {
      assert.throws(() => {
        throw expected;
      }, 'this does not match');
    },
    {
      message: /Function threw unexpected[^]*Expected message to equal/,
    },
  );
});

test('.throws - error - class does not match', function (t) {
  const expected = new SyntaxError('message');
  t.throws(
    () => {
      assert.throws(() => {
        throw expected;
      }, TypeError);
    },
    {
      message: /Function threw unexpected[^]*Expected instance of/,
    },
  );
});

test('.throws - success - no assertions', function (t) {
  const expected = new Error();
  const actual = assert.throws(() => {
    throw expected;
  });
  t.is(actual, expected);
});

test('.throws - success - message string assertion', function (t) {
  const expected = new Error('message');
  const actual = assert.throws(() => {
    throw expected;
  }, 'message');
  t.is(actual, expected);
});

test('.throws - success - message regex assertion', function (t) {
  const expected = new Error('message');
  const actual = assert.throws(() => {
    throw expected;
  }, /^message$/);
  t.is(actual, expected);
});

test('.throws - success - constructor assertion', function (t) {
  const expected = new SyntaxError('message');
  const actual = assert.throws(() => {
    throw expected;
  }, SyntaxError);
  t.is(actual, expected);
});

test('.throws - success - object assertion', function (t) {
  const expected = new SyntaxError('message');
  const actual = assert.throws(
    () => {
      throw expected;
    },
    {
      instanceOf: SyntaxError,
      is: expected,
      message: 'message',
      name: 'SyntaxError',
    },
  );
  t.is(actual, expected);
});

test('.throwsAsync - error - non function/promise arguments', function (t) {
  return t.throwsAsync(() => assert.throwsAsync(null), {
    message: /^`assert.throwsAsync\(\)` must be called with a function or promise/,
  });
});

test('.throwsAsync - error - invalid assertion', function (t) {
  const assertion = { pizza: 'not a valid key' };
  return t.throwsAsync(() => assert.throwsAsync(() => 'hi', assertion), {
    message: /^The second argument to `assert.throwsAsync\(\)` contains unexpected/,
  });
});

test('.throwsAsync - error - synchronous return', function (t) {
  return t.throwsAsync(() => assert.throwsAsync(() => 'hello'), {
    message: /Function returned synchronously, use `assert.throws\(\)` instead[^]*Function returned/,
  });
});

test('.throwsAsync - error - synchronous exception', function (t) {
  const thrower = () => {
    throw new Error('typos!');
  };

  return t.throwsAsync(() => assert.throwsAsync(thrower), {
    message: /Function threw synchronously, use `assert.throws\(\)` instead[^]*Function threw/,
  });
});

test('.throwsAsync - error - resolved promise', function (t) {
  const resolution = Promise.resolve('hi');

  return t.throwsAsync(() => assert.throwsAsync(resolution), {
    message: /^Missing expected rejection[^]*Promise resolved with/,
  });
});

test('.throwsAsync - error - resolved promise - custom message', function (t) {
  const resolution = Promise.resolve('hi');

  return t.throwsAsync(() => assert.throwsAsync(resolution, null, 'msg'), {
    message: /^msg[^]*Promise resolved with/,
  });
});

test('.throwsAsync - error - returned resolved promise', function (t) {
  const resolver = () => Promise.resolve('hi');

  return t.throwsAsync(() => assert.throwsAsync(resolver), {
    message: /^Missing expected rejection[^]*Returned promise resolved with/,
  });
});

test('.throwsAsync - error - returned resolved promise - custom message', function (t) {
  const resolver = () => Promise.resolve('hi');

  return t.throwsAsync(() => assert.throwsAsync(resolver, null, 'msg'), {
    message: /^msg[^]*Returned promise resolved with/,
  });
});

test('.throwsAsync - error - string message does not match', function (t) {
  const expected = new Error('message');
  const rejection = Promise.reject(expected);
  return t.throwsAsync(
    () => assert.throwsAsync(rejection, 'this does not match'),
    {
      message: /Promise rejected with unexpected exception[^]*Expected message to equal/,
    },
  );
});

test('.throwsAsync - error - class does not match', function (t) {
  const expected = new SyntaxError('message');
  const rejection = Promise.reject(expected);
  return t.throwsAsync(() => assert.throwsAsync(rejection, TypeError), {
    message: /Promise rejected with unexpected exception[^]*Expected instance of/,
  });
});

test('.throwsAsync - success - no assertions', async t => {
  const expected = new Error();
  const rejection = Promise.reject(expected);

  const actual = await assert.throwsAsync(rejection);
  t.is(actual, expected);
});

test('.throwsAsync - success - message string assertion', async t => {
  const expected = new Error('message');
  const rejection = Promise.reject(expected);

  const actual = await assert.throwsAsync(rejection, 'message');
  t.is(actual, expected);
});

test('.throwsAsync - success - message regex assertion', async t => {
  const expected = new Error('message');
  const rejection = Promise.reject(expected);

  const actual = await assert.throwsAsync(rejection, /^message$/);
  t.is(actual, expected);
});

test('.throwsAsync - success - constructor assertion', async t => {
  const expected = new SyntaxError('message');
  const rejection = Promise.reject(expected);

  const actual = await assert.throwsAsync(rejection, SyntaxError);
  t.is(actual, expected);
});

test('.throwsAsync - success - object assertion', async t => {
  const expected = new SyntaxError('message');
  const rejection = Promise.reject(expected);

  const actual = await assert.throwsAsync(rejection, {
    instanceOf: SyntaxError,
    is: expected,
    message: 'message',
    name: 'SyntaxError',
  });

  t.is(actual, expected);
});

test('.notThrows - error - non function argument', function (t) {
  t.throws(() => assert.notThrows(null), {
    message: /^`assert.notThrows\(\)` must be called with a function/,
  });

  t.throws(() => assert.notThrows(Promise.resolve()), {
    message: /^`assert.notThrows\(\)` must be called with a function/,
  });
});

test('.notThrows - error - asynchronous resolution', function (t) {
  const resolver = () => Promise.resolve();

  t.throws(() => assert.notThrows(resolver), {
    message: /Function returned a promise, use `assert.notThrowsAsync\(\)` instead/,
  });
});

test('.notThrows - error - asynchronous rejection', function (t) {
  const rejecter = () => Promise.reject(new Error('typos!'));

  t.throws(() => assert.notThrows(rejecter), {
    message: /Function returned a promise, use `assert.notThrowsAsync\(\)` instead/,
  });
});

test('.notThrows - error - exception thrown - default message', t => {
  const thrower = () => {
    throw new Error('typos!');
  };

  t.throws(() => assert.notThrows(thrower), {
    message: /^Got unwanted exception[^]*Function threw/,
  });
});

test('.notThrows - error - exception thrown - custom message', t => {
  const thrower = () => {
    throw new Error('typos!');
  };

  t.throws(() => assert.notThrows(thrower, 'my message'), {
    message: /^my message[^]*Function threw/,
  });
});

test('.notThrows - success', function (t) {
  t.notThrows(() => assert.notThrows(() => 'hello there'));
});

test('.notThrowsAsync - error - non function/promise argument', t => {
  return t.throwsAsync(() => assert.notThrowsAsync(null), {
    message: /^`assert.notThrowsAsync\(\)` must be called with a function/,
  });
});

test('.notThrowsAsync - error - synchronous exception', function (t) {
  const thrower = () => {
    throw new Error('typos!');
  };

  return t.throwsAsync(() => assert.notThrowsAsync(thrower), {
    message: /Function threw synchronously, use `assert.notThrows\(\)` instead[^]*Function threw/,
  });
});

test('.notThrowsAsync - error - synchronous return', function (t) {
  return t.throwsAsync(() => assert.notThrowsAsync(() => 'hi'), {
    message: /Function returned synchronously, use `assert.notThrows\(\)` instead[^]*Function returned/,
  });
});

test('.notThrowsAsync - error - rejected promise - default message', t => {
  const rejection = Promise.reject(new Error('error!'));

  return t.throwsAsync(() => assert.notThrowsAsync(rejection), {
    message: /Got unwanted rejection[^]*Promise rejected with:/,
  });
});

test('.notThrowsAsync - error - rejected promise - custom message', t => {
  const rejection = Promise.reject(new Error('error!'));

  return t.throwsAsync(() => assert.notThrowsAsync(rejection, 'mesg'), {
    message: /mesg[^]*Promise rejected with:/,
  });
});

test('.notThrowsAsync - error - returned rejected promise - default message', t => {
  const rejecter = () => Promise.reject(new Error('error!'));

  return t.throwsAsync(() => assert.notThrowsAsync(rejecter), {
    message: /Got unwanted rejection[^]*Returned promise rejected with:/,
  });
});

test('.notThrowsAsync - error - returned rejected promise - custom message', t => {
  const rejecter = () => Promise.reject(new Error('error!'));

  return t.throwsAsync(() => assert.notThrowsAsync(rejecter, 'mesg'), {
    message: /mesg[^]*Returned promise rejected with:/,
  });
});

test('.notThrowsAsync - success - resolved promise', t => {
  const resolution = Promise.resolve('hello');

  return t.notThrowsAsync(() => assert.notThrowsAsync(resolution));
});

test('.notThrowsAsync - success - return resolved promise', t => {
  const resolver = () => Promise.resolve('hello');

  return t.notThrowsAsync(() => assert.notThrowsAsync(resolver));
});

test('.regex()', function (t) {
  t.notThrows(function () {
    assert.regex('abc', /^abc$/);
  });

  t.throws(function () {
    assert.regex('foo', /^abc$/);
  });
});

test('.notRegex()', function (t) {
  t.notThrows(function () {
    assert.notRegex('abc', /def/);
  });

  t.throws(function () {
    assert.notRegex('abc', /abc/);
  });
});

test('.ifError()', function (t) {
  t.throws(function () {
    assert.ifError(new Error());
  });

  t.notThrows(function () {
    assert.ifError(null);
  });
});

test('.deepEqual() should not mask RangeError from assert', function (t) {
  function Circular() {
    this.test = this;
  }

  const a = new Circular();
  const b = new Circular();

  t.throws(function () {
    assert.notDeepEqual(a, b);
  });

  t.notThrows(function () {
    assert.deepEqual(a, b);
  });
});
