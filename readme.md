# Clutch Assert [![Build Status][ci-image]][ci-url] [![NPM package][npm-image]][npm-url]
> "The only assert library that truly comes in clutch"

## What is this?!
"That's a great question, I'm glad you asked"

This project is essentially a combination of ideas from two other projects
[ava](https://github.com/avajs/ava) and
[power-assert](github.com/power-assert-js/power-assert).

It combines the api of ava's assertions with the power of power-assert and also
provides a handy [`.keys`] assertion which can be useful if switching from chai.

## Why/When should I use this?

The library can be very helpful when porting an older codebase to use ava for
testing. Using clutch assert will allow you to incrementally convert all of your
assertions to ava style assertions and then once you're ready to switch just
replace the word assert with ava's assertion mixin variable.

## Quick Start

Install clutch-assert and intelli-espower-loader

```
$ npm install --save clutch-assert intelli-espower-loader
```

Instruct your test runner to require intelli-espower-loader before running tests

Example using [mocha](https://visionmedia.github.io/mocha/)
```
$(npm bin)/mocha --require intelli-espower-loader path/to/test/mocha_node.js
```
For more detailed instructions and use cases please refer to the
[power-assert documentation](https://github.com/power-assert-js/power-assert)

## Usage

```js
const assert = require('clutch-assert');

assert.is(1 + 1, 2);
```

**Note:** Make sure to name the variable assert, due to the way the underlying
dependencies work power-assert won't work correctly if the variable is named
something else.

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

### `.keys(object, keys, [message])`

Assert that `object` contains all of and only the `keys` specified

### `.deepEqual(value, expected, [message])`

Assert that `value` is deep equal to `expected`.

### `.notDeepEqual(value, expected, [message])`

Assert that `value` is not deep equal to `expected`.

### `.throws(function|promise, [error, [message]])`

Assert that `function` throws an error, or `promise` rejects with an error.

`error` can be a constructor, regex, error message or validation function.

Returns the error thrown by `function` or the rejection reason of `promise`.

### `.notThrows(function|promise, [message])`

Assert that `function` doesn't throw an `error` or `promise` resolves.

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

[ci-url]: https://travis-ci.org/smartcar/clutch-assert
[ci-image]: https://img.shields.io/travis/smartcar/clutch-assert/master.svg?style=flat-square
