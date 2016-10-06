import test from 'ava';
import Observable from 'zen-observable';

import assert from '../lib/assert';

// Must export Promise to support Observables on 0.10
global.Promise = Promise;

function throwingObservable() {
  return new Observable(function(subscriber) {
    setTimeout(() => subscriber.error(new Error('foo')), 0);
  });
}

test('.throws()', t => {
  t.notThrows(assert.throws(throwingObservable()));
  t.throws(assert.throws(Observable.of(1, 2, 3)));
});

test('.notThrows()', t => {
  t.notThrows(assert.notThrows(Observable.of(1, 2, 3)));
  t.throws(assert.notThrows(throwingObservable()));
});
