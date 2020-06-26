# Clutch Assert [![NPM package][npm-image]][npm-url] [![Build Status][ci-image]][ci-url] [![Coverage][coverage-image]][coverage-url] [![Greenkeeper][gk-image]][gk-url]

> "The only assert library that truly comes in clutch"

## What is this?!

"That's a great question, I'm glad you asked"

This project is essentially a combination of ideas from two other projects
[ava](https://github.com/avajs/ava) and
[power-assert](http://github.com/power-assert-js/power-assert).

It combines the api of ava's assertions with the power of power-assert and also
provides a handy `.keys` assertion which can be useful if switching from chai.

## Why/When should I use this?

The library can be very helpful when porting an older codebase to use ava for
testing. Using clutch assert will allow you to incrementally convert all of your
assertions to ava style assertions and then once you're ready to switch just
replace the word assert with ava's assertion mixin variable.

**Note:** ava does not have the `.keys` assertion

## Quick Start

Install clutch-assert

```
$ npm install --save clutch-assert
```

Instruct your test runner to require the clutch-assert loader before running tests.
**You will not get enhanced assertion messages if you neglect to require the loader**

Example using [mocha](https://mochajs.org/)

```
$(npm bin)/mocha --require clutch-assert/loader path/to/test/mocha_node.js
```

By default the loader will instrument all files in a directory named `test`, if
your tests are located elsewhere you must provide that path to the loader as
detailed under [loader configuration](https://github.com/smartcar/clutch-assert/#loader-configuration).

## Usage

```js
const assert = require('clutch-assert');

assert.is(1 + 1, 2);
```

**Note:** Make sure to name the variable assert, due to the way the underlying
dependencies work power-assert won't work correctly if the variable is named
something else.

### Loader Configuration

By default the loader instruments all files under the `test` directory, this can be changed
by placing a `.clutchrc` in the root of your project which should be a json file with a `directory`
top-level key.

_Example_

```json
{
  "directory": "test/unit"
}
```

### Using Other Loaders

The [power-assert loaders](https://github.com/power-assert-js/power-assert#be-sure-to-transform-test-code)
do not have support for the `.keys` assertion by default. If you wish to use
that assertion you must import the patterns from clutch assert and configure
the loader to use those patterns.

Here is an example using `espower-loader`

```js
const espower = require('espower-loader');
const patterns = require('clutch-assert/lib/patterns');

espower({
  cwd: process.cwd(),
  pattern: 'test/**/*.js',
  espowerOptions: {
    patterns: pattern.ENHANCED,
  },
});
```

## API

### `.pass([message])`

Passing assertion.

### `.fail([message])`

Failing assertion.

### `.truthy(value, [message])`

Assert that `value` is truthy.

### `.falsy(value, [message])`

Assert that `value` is falsy.

### `.true(value, [message])`

Assert that `value` is `true`.

### `.false(value, [message])`

Assert that `value` is `false`.

### `.is(value, expected, [message])`

Assert that `value` is equal to `expected`.

### `.not(value, expected, [message])`

Assert that `value` is not equal to `expected`.

### `.deepEqual(value, expected, [message])`

Assert that `value` is deeply equal to `expected`.

### `.notDeepEqual(value, expected, [message])`

Assert that `value` is not deeply equal to `expected`.

### `.keys(object, keys, [message])`

Assert that `object` contains all of and only the `keys` specified

### `.throws(fn, expected, [message]])`

Assert that an error is thrown. `fn` must be a function which should throw. The thrown value _must_ be an error. It is returned so you can run more assertions against it.

`expected` can be a constructor, in which case the thrown error must be an instance of the constructor. It can be a string, which is compared against the thrown error's message, or a regular expression which is matched against this message. You can also specify a matcher object with one or more of the following properties:

- `instanceOf`: a constructor, the thrown error must be an instance of
- `is`: the thrown error must be strictly equal to `expected.is`
- `message`: either a string, which is compared against the thrown error's message, or a regular expression, which is matched against this message
- `name`: the expected `.name` value of the thrown error
- `code`: the expected `.code` value of the thrown error

Example:

```js
const fn = () => {
  throw new TypeError('hello there');
};

test('throws', t => {
  const error = t.throws(() => {
    fn();
  }, TypeError);

  t.is(error.message, 'hello there');
});
```

### `.throwsAsync(thrower, expected, [message]])`

Assert that an error is thrown. `thrower` can be an async function which should throw, or a promise that should reject. This assertion must be awaited.

The thrown value _must_ be an error. It is returned so you can run more assertions against it.

`expected` can be a constructor, in which case the thrown error must be an instance of the constructor. It can be a string, which is compared against the thrown error's message, or a regular expression which is matched against this message. You can also specify a matcher object with one or more of the following properties:

- `instanceOf`: a constructor, the thrown error must be an instance of
- `is`: the thrown error must be strictly equal to `expected.is`
- `message`: either a string, which is compared against the thrown error's message, or a regular expression, which is matched against this message
- `name`: the expected `.name` value of the thrown error
- `code`: the expected `.code` value of the thrown error

Example:

```js
test('throws', async t => {
  await t.throwsAsync(
    async () => {
      throw new TypeError('hello there');
    },
    { instanceOf: TypeError, message: 'hello there' },
  );
});
```

```js
const promise = Promise.reject(new TypeError('hello there'));

test('rejects', async t => {
  const error = await t.throwsAsync(promise);
  t.is(error.message, 'hello there');
});
```

### `.notThrows(fn, [message])`

Assert that no error is thrown. `fn` must be a function which shouldn't throw.

### `.notThrowsAsync(nonThrower, [message])`

Assert that no error is thrown. `nonThrower` can be an async function which shouldn't throw, or a promise that should resolve.

Like the `.throwsAsync()` assertion, you must wait for the assertion to complete:

```js
test('resolves', async t => {
  await t.notThrowsAsync(promise);
});
```

### `.regex(contents, regex, [message])`

Assert that `contents` matches `regex`.

### `.notRegex(contents, regex, [message])`

Assert that `contents` does not match `regex`.

### `.ifError(error, [message])`

Assert that `error` is falsy.

## Customization API

`clutch-assert` provides an API for customization through which you can
customize clutch-assert by changing some options.

```js
const assert = require('clutch-assert').customize({
  output: {
    maxDepth: 2,
  },
});
```

### options

`options` has two top-level keys. `assertion` and `output`.

#### options.assertion

Customization options for [empower](https://github.com/power-assert-js/empower) module.
See [empower API documentation](https://github.com/power-assert-js/empower#api) for details.
Note that some default values are different from `empower`'s
(`modifyMessageOnRethrow: true` and `saveContextOnRethrow: true`).

#### options.output

Customization options for [power-assert-formatter](https://github.com/power-assert-js/power-assert-formatter) module.
See [power-assert-formatter API documentation](https://github.com/power-assert-js/power-assert-formatter#api) for details.

#### default values

Customizable properties and their default values are as follows.

```js
const assert = require('clutch-assert').customize({
  assertion: {
    destructive: false,
    modifyMessageOnRethrow: true,
    saveContextOnRethrow: true,
    patterns: [
      'assert.truthy(value, [message])',
      'assert.falsy(value, [message])',
      'assert.true(value, [message])',
      'assert.false(value, [message])',
      'assert.is(value, expected, [message])',
      'assert.not(value, expected, [message])',
      'assert.deepEqual(value, expected, [message])',
      'assert.notDeepEqual(value, expected, [message])',
      'assert.regex(contents, regex, [message])',
      'assert.notRegex(contents, regex, [message])',
      'assert.keys(object, keys, [message])',
    ],
  },
  output: {
    lineDiffThreshold: 5,
    maxDepth: 1,
    anonymous: 'Object',
    circular: '#@Circular#',
    lineSeparator: '\n',
    ambiguousEastAsianCharWidth: 2,
    widthOf: "(Function to calculate width of string. Please see power-assert-formatter's documentation)"
    stringify: "(Function to stringify any target value. Please see power-assert-formatter's documentation)"
    diff: "(Function to create diff string between two strings. Please see power-assert-formatter's documentation)"
    writerClass: "(Constructor Function for output writer class. Please see power-assert-formatter's documentation)"
    renderers: [
      './built-in/file',
      './built-in/assertion',
      './built-in/diagram',
      './built-in/binary-expression'
    ],
  },
});
```

[npm-url]: https://www.npmjs.com/package/clutch-assert
[npm-image]: https://img.shields.io/npm/v/clutch-assert.svg?style=flat-square
[ci-url]: https://travis-ci.com/smartcar/clutch-assert
[ci-image]: https://img.shields.io/travis/com/smartcar/clutch-assert/master.svg?style=flat-square
[coverage-url]: https://codecov.io/gh/smartcar/clutch-assert
[coverage-image]: https://img.shields.io/codecov/c/github/smartcar/clutch-assert/master.svg?style=flat-square
[gk-url]: https://greenkeeper.io
[gk-image]: https://badges.greenkeeper.io/smartcar/clutch-assert.svg?style=flat-square
