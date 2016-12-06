'use strict';

const test = require('ava');
const assert = require('../../lib/assert');
const Observable = require('zen-observable');

function throwingObservable() {
  return new Observable(function(subscriber) {
    setTimeout(function() { subscriber.error(new Error('foo')); }, 0);
  });
}

test('.throws()', function(t) {
  t.notThrows(assert.throws(throwingObservable()));
  t.throws(assert.throws(Observable.of(1, 2, 3)));
});

test('.notThrows()', function(t) {
  t.notThrows(assert.notThrows(Observable.of(1, 2, 3)));
  t.throws(assert.notThrows(throwingObservable()));
});
