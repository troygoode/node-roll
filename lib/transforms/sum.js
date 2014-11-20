/*jslint indent: 2*/
/*global require: true, module: true*/
(function () {
  'use strict';

  module.exports = function (rolledDice) {
    return rolledDice.reduce(function (sum, value) {
      return Number(sum) + Number(value);
    }, 0);
  };

}());

