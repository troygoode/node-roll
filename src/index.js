/*jslint indent: 2*/
/*global require: true, module: true*/
(function () {
  'use strict';

  var InvalidInputError = require('./input-error.js'),
    transformationFunctions = require('./transforms'),
    transformationKeys = require('./keys'),
    regex =  /^(\d*)d(\d+|\%)(([\+\-\/\*bw])(\d+))?(([\+\-\/\*])(\d+|(\d*)d(\d+|\%)(([\+\-\/\*bw])(\d+))?))*$/,
    roll,
    cleaner,
    sumResult = false,
    filler = [];

  roll = function (random) {
    this.random = random || Math.random.bind(Math);
  };

  roll.prototype.validate = function (s) {
    return regex.test(s);
  };

  roll.prototype.parse = function (s) {
    if (!this.validate(s)) {
      throw new InvalidInputError(s);
    }

    var match = regex.exec(s),
      quantity = match[1], // 2d20+3 => 2
      sides = match[2], // 2d20+3 => 20
      hasTransformation = !!match[3], // 2d20+3 => true
      operator,
      transformationParameter,
      transforms = [],
      opIndex = 0,
      segments = s.split(/[\+\-]/),
      outsideRoll,
      seg;

    if (segments[0].indexOf('b') > -1 || segments[0].indexOf('w') > -1) {
      transforms.push(transformationKeys[match[4]](parseInt(match[5], 10)));
    }

    for (seg = 1; seg < segments.length; seg += 1) {
      opIndex += segments[seg - 1].length;
      operator = s[opIndex]; // 2d20+3 => "+"
      opIndex += 1;
      transformationParameter = segments[seg]; // 2d20+3 => 3
      if (transformationParameter.indexOf('d') > -1) { // perform a roll
        outsideRoll = this.roll(transformationParameter, true);
        transforms.push(transformationKeys[operator](outsideRoll.result));
      } else {
        transforms.push(transformationKeys[operator](parseInt(transformationParameter, 10)));
      }
    }

    return {
      quantity: quantity ? parseInt(quantity, 10) : 1,
      sides: sides === '%' ? 100 : parseInt(sides, 10),
      transformations: hasTransformation || transforms.length > 0 ? transforms.length > 0 ? transforms : transformationKeys[match[4]](parseInt(match[5], 10)) : ['sum'],
      toString: function () {
        return s;
      }
    };
  };

  roll.prototype.roll = function (input, invokedByParse) {
    if (!input) {
      throw new InvalidInputError();
    } else if (typeof input === 'string') {
      input = this.parse(input);
    }

    var rolled = [],
     calculations = [],
     carryFiller = [];

    while (rolled.length < input.quantity) {
      rolled.push(Math.floor((this.random() * input.sides) + 1));
    }

    filler.push(rolled);

    calculations = input.transformations.reduce(function (previous, transformation) {
      var transformationFunction,
        transformationAdditionalParameter,
        sumParam = false;
      if (typeof transformation === 'function') { // lets you pass something custom in
        transformationFunction = transformation;
      } else if (typeof transformation === 'string') { // "sum"
        transformationFunction = transformationFunctions[transformation];
      } else if (transformation instanceof Array) { // ["add", 3]
        if (transformation[0] instanceof Array) {
          sumResult = true;
          cleaner = transformation[1];
          transformation = transformation[0];
        } else if (transformation[1] instanceof Array) {
          sumParam = true;
          cleaner = transformation[0];
          transformation = transformation[1];
        }
        transformationFunction = transformationFunctions[transformation[0]]; // fn for "add"
        transformationAdditionalParameter = transformation[1];
      }
      if (sumParam === true && previous[0]  instanceof Array) {
        previous[0] = transformationFunctions[cleaner](previous[0]);
      }
      previous.unshift(transformationFunction(previous[0], transformationAdditionalParameter));
      return previous;
    }, [rolled]);

    if (sumResult === true && calculations[0] instanceof Array) {
      calculations[1] = calculations[0];
      calculations[0] = transformationFunctions[cleaner](calculations[0]);
    }

    if (!invokedByParse) {
      if (filler.length > 1) {
        filler.unshift(filler.pop());
      }
      carryFiller = filler.length === 1 ? filler[0] : filler;
      filler = [];
    }

    return {
      input: input,
      calculations: calculations,
      rolled: carryFiller,
      result: calculations[0]
    };
  };

  module.exports = roll;
  module.exports.InvalidInputError = InvalidInputError;

}());
