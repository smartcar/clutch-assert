'use strict';

const test = require('ava');
const {sep} = require('path');
const helpers = require('../../loader/helpers');

test('getDirectory', t => {

  t.is(helpers.getDirectory(), 'test');
  t.is(helpers.getDirectory({directory: 'other'}), 'other');
  t.is(helpers.getDirectory({directory: 'other\\'}), 'other');
  t.is(helpers.getDirectory({directory: 'other/'}), 'other');

});


test('checkDirectory', t => {

  t.notThrows(function() {
    helpers.checkDirectory('lib');
  });

  t.throws(function() {
    helpers.checkDirectory('what');
  });

});


test('createPattern', t => {

  t.is(helpers.createPattern('mytestdir'), `mytestdir${sep}**${sep}*.js`);

});
