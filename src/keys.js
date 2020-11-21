/*jslint indent: 2*/
/*global require: true, module: true*/
(function () {
  'use strict';

  module.exports = {
    '+': function (value) {
      return [
        'sum',
        ['add', value]
      ];
    },
    '-': function (value) {
      return [
        'sum',
        ['subtract', value]
      ];
    },
    '*': function (value) {
      return [
        'sum',
        ['multiply', value]
      ];
    },
    '/': function (value) {
      return [
        'sum',
        ['divide', value]
      ];
    },
    'b': function (value) {
      return [
        ['best-of', value],
        'sum'
      ];
    },
    'w': function (value) {
      return [
        ['worst-of', value],
        'sum'
      ];
    }
  };

}());

