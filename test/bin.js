/*jslint indent: 2*/
/*global require: true, module: true, describe: true, it: true, beforeEach: true, __dirname: true, console: true, process: true */
(function () {
  'use strict';

  var exec = require('child_process').exec,
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
    ]);

  describe('bin/roll', function () {

    beforeEach(random.reset.bind(random));

    it('bin/roll garbage', function (done) {
      exec((process.platform === 'win32' ? 'node ././bin/roll' : __dirname + '/../bin/roll') + ' garbage', function (err, stdout, stderr) {
        if (err) {
          should.exist(err);
          stderr.should.eql('"garbage" is not a valid input string for node-roll.\n');
          return done();
        }
        done('Should not be reachable.');
      });
    });

    it('bin/roll 2d20', function (done) {
      exec((process.platform === 'win32' ? 'node ././bin/roll' : __dirname + '/../bin/roll') + ' 2d20', function (err, stdout, stderr) {
        if (err) {
          return done(err);
        }
        /^\d+\n$/.test(stdout).should.eql(true);
        done();
      });
    });

    it('bin/roll -d 2d20', function (done) {
      exec((process.platform === 'win32' ? 'node ././bin/roll' : __dirname + '/../bin/roll') + ' -d 2d20', function (err, stdout, stderr) {
        if (err) {
          return done(err);
        }
        stdout.should.match(/^Dice: (\d+)(,\s*\d+)*\nTotal: \d+\n$/);
        done();
      });
    });

  });
}());
