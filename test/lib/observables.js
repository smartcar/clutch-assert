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
  await t.notThrows(assert.throws(throwingObservable()));
  await t.throws(assert.throws(Observable.of(1, 2, 3)));
});

test('.notThrows()', async function(t) {
  await t.notThrows(assert.notThrows(Observable.of(1, 2, 3)));
  await t.throws(assert.notThrows(throwingObservable()));
});
