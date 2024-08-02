(function () {
  "use strict";

  module.exports = function (rolledDice) {
    return rolledDice.reduce(function (sum, value) {
      return sum + value;
    }, 0);
  };
})();
