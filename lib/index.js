/*jslint indent: 2*/
/*global require: true, module: true*/
(function () {
  'use strict';

  var InvalidInputError = require('./input-error.js'),
    transformationFunctions = require('./transforms'),
    transformationKeys = require('./keys'),
    regex = /^(\d*)d(\d+|\%)(([\+\-\/\*b])(\d+))?$/,
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

    var match = regex.exec(s);
    return {
      quantity: match[1] ? match[1] : 1,
      sides: match[2] === '%' ? 100 : match[2],
      transformations: match[3] ? transformationKeys[match[4]](match[5]) : ['sum'],
      toString: function () {
        return s;
      }
    };
  };

  roll.prototype.roll = function (input) {
    if (typeof input === 'string') {
      input = this.parse(input);
    }

    var rolled = [],
     calculations = [],
     result,
     i;

    for (i = 0; i < input.quantity; i = i + 1) {
      rolled.push(Math.floor((this.random() * input.sides) + 1));
    }

    result = rolled;
    input.transformations.forEach(function (transformation) {
      calculations.unshift(result);
      var transformationFunction =
        typeof transformation === 'function' ? transformation
          : transformationFunctions[
            typeof transformation === 'string' ? transformation
              : transformation[0]
          ];
      result = transformationFunction(
        result,
        typeof transformation === 'string' ||
        typeof transformation === 'function' ? null
          : transformation[1]
      );
    });
    calculations.unshift(result);

    return {
      input: input,
      calculations: calculations,
      rolled: calculations[calculations.length - 1],
      result: result
    };
  };

  module.exports = roll;
  module.exports.InvalidInputError = InvalidInputError;

}());

