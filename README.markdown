# roll

Roll is a node.js package for rolling dice and adding modifiers (such as "2d6+1").

[![NPM](https://nodei.co/npm/roll.png?downloads=true&stars=true)](https://nodei.co/npm/roll/)

[![build status](https://secure.travis-ci.org/troygoode/node-roll.png)](http://travis-ci.org/troygoode/node-roll)

## How To Use (From Shell)

### Installation (via [npm](https://npmjs.org/package/roll))

```bash
$ npm install -g roll
```

### Usage

```bash
$ roll 2d6+3
9
$ roll d20
15
$ roll d%
99
```

## How To Use (As Library)

### Installation (via [npm](https://npmjs.org/package/roll))

```bash
$ npm install roll
```

### Usage

Get an instance of the library:

```javascript
var Roll = require('roll'),
  roll = new Roll();
```

Rolling a single die:

```javascript
var oneDie = roll.roll('d6');
console.log(oneDie.result); //random number between 1 and 6 (inclusive)
```

Rolling multiple dice:

```javascript
var twoTwenties = roll.roll('2d20');
console.log(twoTwenties.result); //random number between 2 and 40 (inclusive)
```

Rolling multiple sets of dice:

```javascript
var bunchOfDice = roll.roll('2d20+1d12');
console.log(bunchOfDice.result); //random number between 3 and 52 (inclusive)
```

Rolling a percentage:

```javascript
var chance = roll.roll('d%'); //same as '1d100', 'd100', or '1d%'
console.log(chance.result); //random number between 1 and 100 (inclusive)
```

Simple calculation (+, -, *, /):

```javascript
var attack = roll.roll('2d6+2');
console.log(attack.result); //random number between 3 and 8 (inclusive)
```

Seeing what was rolled, rather than the sum:

```javascript
var yahtzee = roll.roll('5d6');
console.log(yahtzee.rolled); //yahtzee.rolled will return something like [5, 2, 4, 6, 1] rather than the sum

var blessedSneaker = roll.roll('2d20b1+1d4+5');
console.log(blessedSneaker.rolled); // blessedSneaker.rolled will return an array containing an array for each component that is a roll of the dice, in the order in which they occurred, e.g. [[19,3],[1]]
```

Getting the highest two dice of the set:

```javascript
var pickBestTwo = roll.roll('6d20b2'); //roll 6 dice and give me the 2 highest
console.log(pickBestTwo.calculations[1]); //pickBestTwo.calculations[0] is the same as .result, .calculations[1] is prior to the sum operation
```

Processing rolls without parsing a string:

```javascript
var attack = roll.roll({
    quantity: 2,
    sides: 6,
    transformations: [ //can list n-number of pipeline operations to perform on the result
      'sum', //take the array of rolled dice and sum them together
      ['add', 2] //add 2 to the sum
    ]
});
console.log(attack.result); //random number between 3 and 8 (inclusive)
```

Using custom transformations:

```javascript
var dropOnes = function(results){
  return results.filter(function (result) {
    return result !== 1;
  });
};
var noOnes = roll.roll({
  quantity: 5,
  sides: 4,
  transformations: [
    dropOnes, // remove any 1s because we have teh lucky bootz
    'sum'
  ]
});
```

Using a custom seed:

```javascript
var srand = require('srand'); //https://github.com/isaacs/node-srand (npm install srand)
srand.seed(1000);

roll = new Roll(function () {
  return srand.random();
});

console.log(roll.roll('2d6+5').result);
```

Validating user input:

```javascript
var userInput = 'this isn\'t a valid roll',
  valid = roll.validate(userInput);

if (!valid) {
  console.error('"%s" is not a valid input string for node-roll!', userInput);
}
```

## Credits

Inspired by [Phillip Newton's Games::Dice](http://search.cpan.org/~pne/Games-Dice-0.02/Dice.pm).

## License

[MIT License](http://www.opensource.org/licenses/mit-license.php)

## Author

[Troy Goode](https://github.com/TroyGoode) ([troygoode@gmail.com](mailto:troygoode@gmail.com))

