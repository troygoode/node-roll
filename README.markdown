# roll

Roll is a node.js package for rolling dice and adding modifiers (such as "2d6+1").

## How To Use (From Shell)

### Installation

```bash
$ npm install roll -g
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

### Installation

```bash
$ npm install roll
```

### Usage

Rolling dice:

```javascript
var roll = require('roll');
var twoTwenties = roll.roll('2d20');
console.log(twoTwenties.result); //random number between 2 and 40 (inclusive)
```

Rolling a percentage:

```javascript
var roll = require('roll');
var chance = roll.roll('d%'); //same as '1d100', 'd100', or '1d%'
console.log(chance.result); //random number between 1 and 100 (inclusive)
```

Simple calculation (+, -, *, /):

```javascript
var roll = require('roll');
var attack = roll.roll('2d6+2');
console.log(attack.result); //random number between 3 and 8 (inclusive)
```

Seeing what was rolled, rather than the sum:

```javascript
var roll = require('roll');
var yahtzee = roll.roll('5d6');
console.log(yahtzee.rolled); //yahtzee.rolled will return something like [5, 2, 4, 6, 1] rather than the sum
```

Getting the highest three dice of the set:

```javascript
var roll = require('roll');
var pickBestTwo = roll.roll('6d20b2'); //roll 6 dice and give me the 2 highest
console.log(pickBestTwo.calculations[1]); //pickBestTwo.calculations[0] is the same as .result, .calculations[1] is prior to the sum operation
```

Processing rolls without parsing a string:

```javascript
var roll = require('roll');
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
var roll = require('roll');
var dropOnes = function(result){
  var nextResult = [];
  for(var i = 0; i < result.length; i++)
    if(result[i] !== 1)
      nextResult.push(result[i]);
  return nextResult;
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
    
var roll = require('roll');
roll.random = function(){ return srand.rand(); };
    
console.log(roll.roll('2d6+5').result);
```

## Credits

Inspired by [Phillip Newton's Games::Dice](http://search.cpan.org/~pne/Games-Dice-0.02/Dice.pm).

## License

[MIT License](http://www.opensource.org/licenses/mit-license.php)

## Author

[Troy Goode](https://github.com/TroyGoode) ([troygoode@gmail.com](mailto:troygoode@gmail.com))
