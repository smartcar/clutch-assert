'use strict';

const fs = require('fs');
const path = require('path');

const DEFAULT_DIRECTORY = 'test';

function getDirectory(rc) {

  if (!(typeof rc === 'object' && rc.directory)) {
    return DEFAULT_DIRECTORY;
  }

  const dir = rc.directory;
  const last = dir.substring(dir.length - 1);

  // strip trailing slashes
  if (last === '/' || last === '\\') {
    return dir.substring(0, dir.length - 1);
  }

  return dir;
}

function checkDirectory(dir) {

  dir = path.resolve(dir);
  try {
    fs.accessSync(dir, fs.constants.F_OK);
  } catch (e) { // eslint-disable-next-line max-len
    e.message = `(clutch-assert/loader) Tried to instrument ${dir} but it does not exist.
    Please specify the correct directory in .clutchrc as follows:
    {
      "directory": "test-unit"
    }
    `;
    throw e;
  }

}

function createPattern(dir) {
  return dir + path.sep + '**' + path.sep + '*.js';
}

module.exports = {getDirectory, checkDirectory, createPattern};
