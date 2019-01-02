'use strict';

/* eslint-disable global-require */

const os = require('os');
const fs = require('fs');
const test = require('ava');
const path = require('path');
const sinon = require('sinon');
const mockery = require('mockery');
const helpers = require('../../loader/helpers');

// eslint-disable-next-line no-process-env
if (process.env.NYC_CONFIG) {
  // silence mockery when running coverage
  mockery.warnOnUnregistered(false);
}

/**
 * Creates a temporary directory and writes a .clutchrc file in that directory
 *
 * @param {String} data - the data to be written to the rc file
 * @return {String} the directory in which the file was written
 */
function writeRC(data) {
  return new Promise(function(resolve, reject) {

    fs.mkdtemp(os.tmpdir() + path.sep, function(err, dir) {
      if (err) { return reject(err); }
      fs.writeFile(path.join(dir, '.clutchrc'), data, function(err) {
        if (err) { return reject(err); }
        return resolve(dir);
      });
    });

  });
}

test.before(function() {
  mockery.enable({
    useCleanCache: true,
  });
});

test.beforeEach(function(t) {
  t.context.stub = sinon.stub();
  mockery.registerMock('espower-loader', t.context.stub);
  mockery.resetCache();
  mockery.registerAllowables(['fs', 'path', '../../loader', '../lib/patterns']);
});

test.afterEach.always.cb(function(t) {
  mockery.deregisterAll();
  if (t.context.path) {
    fs.unlink(t.context.path, () => t.end());
  } else {
    t.end();
  }
});

test.after.always(function() {
  mockery.disable();
});

test.serial('no rc file', function(t) {

  const mock = Object.assign({}, helpers, {
    findParent: () => __dirname,
  });

  mockery.registerMock('./helpers', mock);
  mockery.registerMock('../lib/patterns', {
    ENHANCED: 'MOCK',
  });

  require('../../loader');

  t.true(t.context.stub.called);

  const arg = t.context.stub.args[0][0];
  t.is(arg.pattern, 'test/**/*.js');
  t.is(arg.cwd, process.cwd());
  t.is(arg.espowerOptions.patterns, 'MOCK');

});

test.serial('valid rc file', async function(t) {

  const path = t.context.path = await writeRC('{"directory": "mock"}');

  const mock = Object.assign({}, helpers, {
    findParent: () => path,
    checkDirectory: () => true,
  });

  mockery.registerMock('./helpers', mock);

  require('../../loader');

  t.true(t.context.stub.called);

  const arg = t.context.stub.args[0][0];

  t.is(arg.pattern, 'mock/**/*.js');

});

test.serial('invalid rc file', async function(t) {

  const path = t.context.path = await writeRC('this is not JSON');

  mockery.registerMock('./helpers', {
    findParent: () => path,
  });

  const err = t.throws(() => require('../../loader'), SyntaxError);

  t.regex(err.message, /^Unexpected token \w+( in JSON at position \d+)?$/);

});

test.serial('integration', async function(t) {

  const path = t.context.path = await writeRC('{"directory": "test/fixtures"}');

  mockery.warnOnUnregistered(false);
  mockery.deregisterMock('espower-loader');

  const mock = Object.assign({}, helpers, {
    findParent: () => path,
  });

  mockery.registerMock('./helpers', mock);

  require('../../loader');


  const err = t.throws(function() {
    require('../fixtures/to_be_instrumented');
  });

  t.is(err.message, "Cannot find module 'power-assert'");

});
