/*jslint indent: 2*/
/*global require: true, module: true*/
(function () {
  'use strict';

  module.exports = function (rolledDice, value) {
    var sum = 0,
      i;
    for (i = 0; i < rolledDice.length; i = i + 1) {
      sum += rolledDice[i];
    }
    return sum;
  };

}());

