(function () {
  "use strict";

  var FakeRandomNumberGenerator = function (numbers) {
    this.pointer = 0;
    this.numbers = numbers;
  };

  FakeRandomNumberGenerator.prototype.reset = function () {
    this.pointer = 0;
  };

  FakeRandomNumberGenerator.prototype.next = function () {
    this.pointer = this.pointer + 1;
    if (this.pointer > this.numbers.length) {
      this.pointer = 1;
    }
    return this.numbers[this.pointer - 1];
  };

  module.exports = FakeRandomNumberGenerator;
})();
