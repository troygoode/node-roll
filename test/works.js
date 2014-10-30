/*jslint indent: 2*/
/*global require: true, module: true, describe: true, it: true, beforeEach: true */
(function () {
  'use strict';

  var should = require('should'),
    Roll = require('../lib'),
    randomSet = [ // set of random numbers I'll pull from
      0.24,
      0.62
    ],
    randomPointer = 0,
    roll = new Roll(function () {
      // can only test this library if we make things not random
      randomPointer = randomPointer + 1;
      return randomSet[randomPointer - 1];
    });

  describe('roll', function () {
    beforeEach(function () {
      randomPointer = 0;
    });

    it('addition works', function () {
      var result = roll.roll('2d20+3');
      result.result.should.equal(21);
    });

    it('subtraction works', function () {
      var result = roll.roll('2d20-3');
      result.result.should.equal(15);
    });

    it('validates input', function (done) {
      try {
        roll.roll('garbage');
        done('Should not be reachable.');
      } catch (e) {
        should.exist(e);
        e.name.should.eql('InvalidInputError');
        e.message.should.eql('"garbage" is not a valid input string for node-roll.');
        e.input.should.eql('garbage');
        done();
      }
    });

    it('exposes validation', function () {
      roll.validate('2d20-3').should.equal(true);
      roll.validate('garbage').should.equal(false);
    });
  });

}());

