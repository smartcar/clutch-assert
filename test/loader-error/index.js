'use strict';

/* eslint-disable global-require */

const test = require('ava');

test.afterEach(function() {

  delete require.cache[require.resolve('../../loader')];
});

test('does not swallow errors', function(t) {

  const err = t.throws(function() {
    require('../../loader');
  }, SyntaxError);


  t.true(err.message.includes('Unexpected token g'));
});
