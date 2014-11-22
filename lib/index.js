/*jslint indent: 2*/
/*global require: true, module: true*/
(function () {
  'use strict';

  var InvalidInputError = require('./input-error.js'),
    transformationFunctions = require('./transforms'),
    transformationKeys = require('./keys'),
    regex = /^(\d*)d(\d+|\%)(([\+\-\/\*bw])(\d+))?$/,
    roll;

  roll = function (random) {
    this.random = random || function () {
      return Math.random();
    };
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
      segments = s.split(/[\+\-]/);

    if (segments[0].indexOf('b') > -1) {
      transforms.push(transformationKeys[match[4]](parseInt(match[5], 10)));
    }
    for (var seg = 1; seg < segments.length; seg++) {
      opIndex += segments[seg - 1].length;
      operator = s[opIndex]; // 2d20+3 => "+"
      opIndex += 1;
      transformationParameter = segments[seg]; // 2d20+3 => 3
      if (transformationParameter.indexOf('d') > -1) {
        transforms.push(transformationKeys[operator](parseInt(this.roll(transformationParameter).result, 10)));
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

  roll.prototype.roll = function (input) {
    if (!input) {
      throw new InvalidInputError();
    } else if (typeof input === 'string') {
      input = this.parse(input);
    }

    var rolled = [],
     calculations = [];

    while (rolled.length < input.quantity) {
      rolled.push(Math.floor((this.random() * input.sides) + 1));
    }

    calculations = input.transformations.reduce(function (previous, transformation) {
      var transformationFunction,
        transformationAdditionalParameter;

      if (typeof transformation === 'function') { // lets you pass something custom in
        transformationFunction = transformation;
      } else if (typeof transformation === 'string') { // "sum"
        transformationFunction = transformationFunctions[transformation];
      } else if (transformation instanceof Array) { // ["add", 3]
        transformationFunction = transformationFunctions[transformation[0]]; // fn for "add"
        transformationAdditionalParameter = transformation[1]; // 3
      }

      previous.unshift(transformationFunction(previous[0], transformationAdditionalParameter));
      return previous;
    }, [rolled]);

    return {
      input: input,
      calculations: calculations,
      rolled: calculations[calculations.length - 1],
      result: Number(calculations[0].toString())
    };
  };

  module.exports = roll;
  module.exports.InvalidInputError = InvalidInputError;

}());

