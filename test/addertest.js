/* global describe,it */
'use strict';

describe('Adder test', function () {
  var adder = require('../client/scripts/adder');
  it('pass', function () {
    adder.add(3, 5).should.equal(8);
  });
});
