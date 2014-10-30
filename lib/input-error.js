/*jslint indent: 2*/
/*global require: true, module: true*/
(function () {
  'use strict';

  var util = require('util');

  function InvalidInputError(input) {
    this.name = 'InvalidInputError';
    if (input) {
      this.message = util.format('"%s" is not a valid input string for node-roll.', input);
    } else {
      this.message = 'No input string was supplied to node-roll.';
    }
    this.input = input;
  }

  InvalidInputError.prototype = new Error();
  InvalidInputError.prototype.constructor = InvalidInputError;

  module.exports = InvalidInputError;

}());

