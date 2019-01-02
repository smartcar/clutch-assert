'use strict';

const test = require('ava');
const assert = require('../../lib/assert');
const Observable = require('zen-observable');

function throwingObservable() {
  return new Observable(function(subscriber) {
    setTimeout(function() { subscriber.error(new Error('foo')); }, 0);
  });
}

test('.throws()', async function(t) {
  await t.notThrowsAsync(assert.throws(throwingObservable()));
  await t.throwsAsync(assert.throws(Observable.of(1, 2, 3)));
});

test('.notThrows()', async function(t) {
  await t.notThrowsAsync(assert.notThrows(Observable.of(1, 2, 3)));
  await t.throwsAsync(assert.notThrows(throwingObservable()));
});
