/*jslint indent: 2*/
/*global require: true, module: true, describe: true, it: true, beforeEach: true, __dirname: true */
(function () {
  'use strict';

  var exec = require('child_process').exec,
    should = require('should'),
    Roll = require('../lib'),
    FakeRandom = require('./fake-random'),
    random = new FakeRandom([ // can only test this library if we make things not actually random
      0.24, // 20 * .24 =>  4.8 =>  5
      0.62, // 20 * .62 => 12.4 => 13
      0.51, // 20 * .51 => 10.2 => 11
      0.13, // 20 * .13 =>  2.6 =>  3
      0.66  // 20 * .66 => 13.2 => 14
    ]),
    roll = new Roll(random.next.bind(random));

  describe('roll', function () {

    beforeEach(random.reset.bind(random));

    it('d20', function () {
      var result = roll.roll('d20');
      result.rolled.length.should.equal(1);
      result.rolled[0].should.equal(5);
      result.result.should.equal(5);
    });

    it('d%', function () {
      var result = roll.roll('d%');
      result.rolled.length.should.equal(1);
      result.rolled[0].should.equal(25);
      result.result.should.equal(25);
    });

    it('2d20', function () {
      var result = roll.roll('2d20');
      result.rolled.length.should.equal(2);
      result.rolled[0].should.equal(5);
      result.rolled[1].should.equal(13);
      result.result.should.equal(18);
    });

    it('2d20+3', function () {
      var result = roll.roll('2d20+3');
      result.result.should.equal(21); // SUM + 3
    });

    it('2d20-3', function () {
      var result = roll.roll('2d20-3');
      result.result.should.equal(15); // SUM - 3
    });

    it('2d20*3', function () {
      var result = roll.roll('2d20*3');
      result.result.should.equal(54); // SUM * 3
    });

    it('2d20/3', function () {
      var result = roll.roll('2d20/3');
      result.result.should.equal(6); // SUM / 3
    });

    it('5d20b1', function () {
      var result = roll.roll('5d20b1');
      result.result.should.equal(14);
    });

    it('5d20b2', function () {
      var result = roll.roll('5d20b2');
      result.calculations[1].length.should.equal(2);
      result.calculations[1][0].should.equal(14);
      result.calculations[1][1].should.equal(13);
      result.result.should.equal(27); // 14 + 13
    });

    it('5d20w1', function () {
      var result = roll.roll('5d20w1');
      result.result.should.equal(3);
    });

    it('5d20w2', function () {
      var result = roll.roll('5d20w2');
      result.calculations[1].length.should.equal(2);
      result.calculations[1][0].should.equal(3);
      result.calculations[1][1].should.equal(5);
      result.result.should.equal(8); // 3 + 5
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
      roll.validate('2d20+3').should.equal(true);
      roll.validate('garbage').should.equal(false);
    });

    it('bin/roll garbage', function (done) {
      exec(__dirname + '/../bin/roll garbage', function (err, stdout, stderr) {
        if (err) {
          should.exist(err);
          stderr.should.eql('"garbage" is not a valid input string for node-roll.\n');
          return done();
        }
        done('Should not be reachable.');
      });
    });

    it('bin/roll 2d20', function (done) {
      exec(__dirname + '/../bin/roll 2d20', function (err, stdout, stderr) {
        if (err) {
          return done(err);
        }
        /^\d+\n$/.test(stdout).should.eql(true);
        done();
      });
    });

  });
}());

