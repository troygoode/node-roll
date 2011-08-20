var roll = require("./index");

var result1 = roll.roll("2d6+3"); // same as below
var result2 = roll.roll({
  quantity: 2,
  sides: 6,
  transformations: [
    'sum',
    ['add', 3]
  ]
});

console.log(result2.rolled); //[5, 2]
console.log(result2.result); //10 (because 7 from above + 3)