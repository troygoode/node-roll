/*jslint indent: 2*/
/*global require: true, module: true, describe: true, it: true, beforeEach: true, __dirname: true, console: true, process: true */
(function () {
  'use strict';

  var Roll = require('../src'),
    should = require('should'),
    FakeRandom = require('./fake-random'),
    random = new FakeRandom([ // can only test this library if we make things not actually random
      0.24, // 20 * .24 =>  4.8 =>  5
      0.62, // 20 * .62 => 12.4 => 13
      0.51, // 20 * .51 => 10.2 => 11
      0.13, // 20 * .13 =>  2.6 =>  3
      0.66, // 20 * .66 => 13.2 => 14
      0.33, // 20 * .66 =>  6.6 =>  7
      0.12  // 20 * .12 =>  2.4 =>  2
    ]),
    roll = new Roll(random.next.bind(random));

  describe('roll', function () {

    beforeEach(random.reset.bind(random));

    describe('multiroll', function () {

      it('1d20+1d20', function () {
        var result = roll.roll('1d20+1d20');
        result.result.should.equal(18);
      });

      it('d20+1d20', function () {
        var result = roll.roll('d20+1d20');
        result.result.should.equal(18);
      });

      it('1d20+d20', function () {
        var result = roll.roll('1d20+d20');
        result.result.should.equal(18);
      });

      it('d20+d20', function () {
        var result = roll.roll('d20+d20');
        result.result.should.equal(18);
      });

      it('2d20b1+1d4', function () {
        var result = roll.roll('2d20b1+1d4');
        result.rolled.should.eql([[13, 11], [1]]);
      });
    });

    describe('bug reports', function () {
      it('issue #7', function () {
        // https://github.com/troygoode/node-roll/issues/7
        var result = roll.roll('2d10+5');
        result.rolled.length.should.equal(2);
        result.rolled[0].should.equal(3);
        result.rolled[1].should.equal(7);
        result.result.should.equal(15); // (3 + 7) + 5 = 15
      });

      it('issue #11', function () {
        // https://github.com/troygoode/node-roll/issues/11
        var result = roll.roll('2d20w1+5');
        result.rolled.length.should.equal(2);
        result.rolled[0].should.equal(5);
        result.rolled[1].should.equal(13);
        result.result.should.equal(10); // worst(5, 13) + 5 = 5 + 5 = 10
      });
    });

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

    it('1d20+2d20', function () {
      var result = roll.roll('1d20+2d20');
      result.rolled.length.should.equal(2);
      result.rolled[0][0].should.equal(11);
      result.rolled[1][0].should.equal(5);
      result.rolled[1][1].should.equal(13);
      result.result.should.equal(29);
    });

    it('1d20+2d20+3d20', function () {
      var result = roll.roll('1d20+2d20+3d20');
      result.rolled.length.should.equal(3);
      result.rolled[0][0].should.equal(7);
      result.rolled[1][0].should.equal(5);
      result.rolled[1][1].should.equal(13);
      result.rolled[2][0].should.equal(11);
      result.rolled[2][1].should.equal(3);
      result.rolled[2][2].should.equal(14);
      result.result.should.equal(53);
    });

    it('yahtzee', function () {
      var result = roll.roll('5d6');
      result.rolled.length.should.equal(5);
      result.rolled[0].should.equal(2);
      result.rolled[1].should.equal(4);
      result.rolled[2].should.equal(4);
      result.rolled[3].should.equal(1);
      result.rolled[4].should.equal(4);
      result.result.should.equal(15);
    });

    it('double yahtzee', function () {
      var result = roll.roll('5d6+5d6');
      result.rolled.length.should.equal(2);
      result.rolled[0][0].should.equal(2);
      result.rolled[0][1].should.equal(1);
      result.rolled[0][2].should.equal(2);
      result.rolled[0][3].should.equal(4);
      result.rolled[0][4].should.equal(4);
      result.rolled[1][0].should.equal(2);
      result.rolled[1][1].should.equal(4);
      result.rolled[1][2].should.equal(4);
      result.rolled[1][3].should.equal(1);
      result.rolled[1][4].should.equal(4);
      result.result.should.equal(28);
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

    it('2d20b1+1d4', function () {
      var result = roll.roll('2d20b1+1d4'); // 5, 13, 11
      result.result.should.equal(14);
    });

    it('2d20w1+1d4', function () {
      var result = roll.roll('2d20w1+1d4'); // 5, 13, 11
      result.result.should.equal(12);
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

  });
}());
