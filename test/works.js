var should = require('should')
  , srand = require('srand')
  , roll = require('../lib')
  , randomSet = [ // set of random numbers I'll pull from
    .24,
    .62
  ]
  , randomPointer = 0;

// can only test this library if we make things not random
roll.random = function(){
  return randomSet[randomPointer++];
};

describe('roll', function(){
  beforeEach(function(){
    randomPointer = 0;
  });

  it('addition works', function(){
    var result = roll.roll('2d20+3');
    result.result.should.equal(21);
  });

  it('subtraction works', function(){
    var result = roll.roll('2d20-3');
    result.result.should.equal(15);
  });

  it('validates input', function(){
    (function(){
      roll.roll('garbage')
    }).should["throw"]("Invalid input: garbage");
  });

  it('exposes validation', function(){
    roll.validate('2d20-3').should.equal(true);
    roll.validate('garbage').should.equal(false);
  });
});
