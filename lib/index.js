var transformationKeys = {
  '+': function(value){
    return [
      'sum',
      ['add', value]
    ];
  },
  '-': function(value){
    return [
      'sum',
      ['subtract', value]
    ];
  },
  '*': function(value){
    return [
      'sum',
      ['multiply', value]
    ];
  },
  '/': function(value){
    return [
      'sum',
      ['divide', value]
    ];
  },
  'b': function(value){
    return [
      ['bestOf', value],
      'sum'
    ];
  }
};

var transformationFunctions = {
  'sum': function(rolledDice, value){
    var sum = 0;
    for(var i = 0; i < rolledDice.length; i++)
      sum += rolledDice[i];
    return sum;
  },
  
  'bestOf': function(rolledDice, value){
    var sorted = rolledDice.sort(function(a,b){
      return b - a;
    });
    var result = [];
    for(var i = 0; i < sorted.length && i < (value / 1); i++)
      result.push(sorted[i]);
    return result;
  },
  
  'worstOf': function(rolledDice, value){
    var sorted = rolledDice.sort(function(a,b){
      return a - b;
    });
    var result = [];
    for(var i = 0; i < sorted.length && i < (value / 1); i++)
      result.push(sorted[i]);
    return result;
  },
  
  'add': function(number, value){
    return number + (value / 1);
  },
  
  'subtract': function(number, value){
    return number - value;
  },
  
  'multiply': function(number, value){
    return number * value;
  },
  
  'divide': function(number, value){
    return number / value;
  }
};

var roll = module.exports = {
  
  random: function(){ return Math.random(); },
  
  parse: function(s){
    var regex = /^(\d*)d(\d+|\%)(([\+\-\/\*b])(\d+))?$/;
    var match = regex.exec(s);
    //for(var i = 0; i < match.length; i++) console.log('match#%d: %s', i, match[i]);
    return {
          quantity: match[1]
            ? match[1]
            : 1,
          sides: match[2] === '%'
            ? 100
            : match[2],
          transformations: match[3]
            ? transformationKeys[match[4]](match[5])
            : ['sum'],
          toString: function(){
            return s;
          }
        };
  },
  
  roll: function(input){
    if(typeof input === 'string')
      input = this.parse(input);
    
    var rolled = [];
    for(var i = 0; i < input.quantity; i++)
      rolled.push(Math.floor((this.random() * input.sides) + 1));
    
    var calculations = [];
    var result = rolled;
    for(var i = 0; i < input.transformations.length; i++){
      calculations.unshift(result);
      var transformation = input.transformations[i];
      var transformationFunction =
        typeof transformation === 'function'
          ? transformation
          : transformationFunctions[
            typeof transformation === 'string'
              ? transformation
              : transformation[0]
          ];
      result = transformationFunction(
        result,
        typeof transformation === 'string' ||
        typeof transformation === 'function'
          ? null
          : transformation[1]
      );
    }
    calculations.unshift(result);
    
    return {
      input: input,
      calculations: calculations,
      rolled: calculations[calculations.length - 1],
      result: result
    };
  }
  
};