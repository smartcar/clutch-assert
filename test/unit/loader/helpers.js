'use strict';

const test = require('ava');
const {sep} = require('path');
const helpers = require('../../loader/helpers');

test('findPackageDir', function(t) {

  // example output from module.paths
  const paths = [
    '/home/user/project/node_modules/clutch-assert/loader/node_modules',
    '/home/user/project/node_modules/clutch-assert/node_modules',
    '/home/user/project/node_modules',
    '/home/user/node_modules',
    '/home/node_modules',
    '/node_modules',
  ];

  const path = helpers.findParent(paths);
  t.is(path, '/home/user/project');

});


test('getDirectory', function(t) {

  t.is(helpers.getDirectory(), 'test');
  t.is(helpers.getDirectory(), 'test');
  t.is(helpers.getDirectory('other'), 'test');
  t.is(helpers.getDirectory({directory: 'other'}), 'other');
  t.is(helpers.getDirectory({directory: 'other\\'}), 'other');
  t.is(helpers.getDirectory({directory: 'other/'}), 'other');

});

test('checkDirectory', function(t) {

  t.notThrows(function() {
    helpers.checkDirectory('lib');
  });

  const err = t.throws(function() {
    helpers.checkDirectory('what');
  });

  t.true(err.message.includes('what'));

});


test('createPattern', function(t) {

  t.is(helpers.createPattern('mytestdir'), `mytestdir${sep}**${sep}*.js`);

});
