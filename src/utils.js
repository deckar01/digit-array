var LIMIT = require('./limit');

/**
 * Throw an error if the base is invalid.
 *
 * @param {number} base The base size to check.
 */
var checkBase = function(base){
  if(typeof base !== 'number' || base !== Math.floor(base)) throw('Expected the base to be an integer, but got (' + base + ').');
  if(base < LIMIT.MIN_BASE) throw('Expected a base greater than ' + LIMIT.MIN_BASE + ', but got (' + base + ').');
  if(base > LIMIT.MAX_BASE) throw('Expected a base less than ' + LIMIT.MAX_BASE + ', but got (' + base + ').');
};

/**
 * Throw an error if the alphabet size is smaller than the base size.
 *
 * @param {number} base The base size to check.
 */
var checkAlphabet = function(base, alphabet){
  if(alphabet.length < base) throw('Alphabet must contain at least ' + base + ' numerals.');
};

/**
 * Converts a string to an array of alphabet indexes.
 * Throws an error if the text contains characters not in the alphabet.
 *
 * @param {string} text The text to convert to digits.
 * @param {string} alphabet The alphabet used to decode the text.
 *
 * @return {Array.<number>} The index of each character in the alphabet.
 */
var textToDigits = function(text, alphabet){
  var map = {};
  alphabet.split('').forEach(function(numeral, index){ map[numeral] = index; });

  return text.split('').map(function(numeral){
    var digit = map[numeral];
    if (typeof digit !== 'number') throw('Input contains a character (' + numeral + ') not in the alphabet.');
    return digit;
  });
};


/**
 * Returns the quotient and remainder produced by dividing the dividend by the divisor.
 *
 * @param {number} divident The number that is being divided.
 * @param {number} divisor The number that the dividend will be divided by.
 *
 * @return { {quotient: number, remainder: number} }
 */
var divide = function(dividend, divisor){
  var quotient = Math.floor(dividend / divisor);
  var remainder = dividend - (quotient * divisor);
  return {
    quotient: quotient,
    remainder: remainder
  };
};

module.exports = {
  checkBase: checkBase,
  checkAlphabet: checkAlphabet,
  textToDigits: textToDigits,
  divide: divide
};
