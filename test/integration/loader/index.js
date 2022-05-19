'use strict';

/* eslint-disable global-require */

const os = require('os');
const fs = require('fs').promises;
const test = require('ava');
const path = require('path');
const sinon = require('sinon');
const mockery = require('mockery');
const helpers = require('../../../loader/helpers');

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
async function writeRC(data) {
  const dir = await fs.mkdtemp(os.tmpdir() + path.sep);
  await fs.writeFile(path.join(dir, '.clutchrc'), data);
  return dir;
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

test.afterEach.always(async function(t) {
  mockery.deregisterAll();
  if (t.context.path) {
    await fs.unlink(path.join(t.context.path, '.clutchrc'));
    await fs.rmdir(t.context.path);
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

  require('../../../loader');

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

  require('../../../loader');

  t.true(t.context.stub.called);

  const arg = t.context.stub.args[0][0];

  t.is(arg.pattern, 'mock/**/*.js');

});

test.serial('invalid rc file', async function(t) {

  const path = t.context.path = await writeRC('this is not JSON');

  mockery.registerMock('./helpers', {
    findParent: () => path,
  });

  t.throws(() => require('../../../loader'), {
    instanceOf: SyntaxError,
    message: /^Unexpected token \w+( in JSON at position \d+)?$/,
  });
});

test.serial('integration', async function(t) {

  const path = t.context.path = await writeRC('{"directory": "test/fixtures"}');

  mockery.warnOnUnregistered(false);
  mockery.deregisterMock('espower-loader');

  const mock = Object.assign({}, helpers, {
    findParent: () => path,
  });

  mockery.registerMock('./helpers', mock);

  require('../../../loader');


  const err = t.throws(function() {
    require('../../fixtures/to_be_instrumented');
  });

  t.regex(err.message, /^Cannot find module 'power-assert'/);

});
