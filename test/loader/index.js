'use strict';

/* eslint-disable global-require */

const test = require('ava');

test.serial('overall', function(t) {

  require('../../loader');

  const err = t.throws(function() {
    require('../fixtures/to_be_instrumented');
  });

  t.is(err.message, "Cannot find module 'power-assert'");

});
