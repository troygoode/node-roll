var should = require('should')
  , srand = require('srand')
  , roll = require('../lib');

// can only test this library if we make things not random
roll.random = function(){ return srand.random(); };

describe('roll', function(){
  beforeEach(function(){
    srand.seed(123);
  });

  it('addition works', function(){
    var result = roll.roll('2d20+3');
    result.result.should.equal(8);
  });

  it('subtraction works', function(){
    var result = roll.roll('2d20-3');
    result.result.should.equal(2);
  });
});
