'use strict';

const fs = require('fs');
const path = require('path');

const DEFAULT_DIRECTORY = 'test';

function getDirectory(pkg) {

  const usePkg = typeof pkg === 'object'
              && typeof pkg.directories === 'object'
              && typeof pkg.directories.test === 'string';

  if (!usePkg) {
    return DEFAULT_DIRECTORY;
  }

  const dir = pkg.directories.test;
  const lastChar = dir[dir.length - 1];
  if (lastChar === '/' || lastChar === '\\') {
    return dir.substring(0, dir.length - 1);
  }

  return dir;
}

function checkDirectory(dir) {

  dir = path.resolve(dir);
  try {
    fs.accessSync(dir, fs.constants.F_OK);
  } catch (e) {
    // TODO: determine what should happen if directory is not found
  }

}

function createPattern(dir) {
  return dir + '**' + path.sep + '*.js';
}

module.exports = {getDirectory, checkDirectory, createPattern};
