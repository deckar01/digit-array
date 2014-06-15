(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * Endianess describes the order of significance of a sequence of digits.
 * 
 * @enum {string}
 */
module.exports = {
  big: 'big',
  little: 'little'
};

},{}],2:[function(require,module,exports){
var Endianess = require('./endianess');
var Utils = require('./utils');

/**
 * A number represented as an array of digits of an arbitrary base.
 * @constructor
 *
 * Math: Let n ∈ N, b ∈ N, b >= 2, D = [d | d ∈ N and d < b].
 *       n = SUM(D[i] * b^i), where i ∈ N and i < |D|
 *         = (D[0] * b^0) + (D[1] * b^1) + ... + (D[|D|-1] * b^(|D|-1))
 *
 * @param {number} base The base used to store the digits.
 * @param {Array.<number> | number} [digits=[0]] The initial set of digits or value.
 * @param {Endianess} [endianess=Endianess.big] The endianess of the given digits.
 */
var DigitArray = function(base, digits, endianess){
  Utils.checkBase(base);
  
  this.base = base;
  endianess = endianess || Endianess.big;

  if(typeof digits === 'number'){
    this.digits = [digits];
    this.normalize();
  } else {
    this.digits = digits || [0];
    if(endianess === Endianess.big) this.digits.reverse();
  }
};

/**
 * Adds a value to the number represented by the DigitArray.
 * 
 * Math: Let m ∈ N.
 *       m + n = m + (D[0] * b^0) + (D[1] * b^1) + ... 
 *             = (m + D[0] * b^0) + (D[1] * b^1) + ...
 *             = (m * b^0 + D[0] * b^0) + (D[1] * b^1) + ...
 *             = ((m + D[0]) * b^0) + (D[1] * b^1) + ...
 *
 * @param {number} value The value to add.
 *
 * @return {DigitArray} this
 */
DigitArray.prototype.add = function(value){
  this.digits[0] += value;
  return this.normalize();
};

/**
 * Multiplies a value with the number represented by the DigitArray.
 * 
 * Math: Let m ∈ N.
 *       m * n = m * ((D[0] * b^0) + (D[1] * b^1) + ... + (D[|D|-1] * b^(|D|-1)))
 *             = m * (D[0] * b^0) + m * (D[1] * b^1) + ... + m * (D[|D|-1] * b^(|D|-1)))
 *             = (m * D[0] * b^0) + (m * D[1] * b^1) + ... + (m * D[|D|-1] * b^(|D|-1)))
 *             = ((m * D[0]) * b^0) + ((m * D[1]) * b^1) + ... + ((m * D[|D|-1]) * b^(|D|-1)))
 *
 * @param {number} value The value to multiply.
 *
 * @return {DigitArray} this
 */
DigitArray.prototype.multiply = function(value){
  this.digits = this.digits.map(function(digit){ return value * digit; });
  return this.normalize();
};

/**
 * Normalizes any digits that are larger than the base allows.
 *
 * Math: Let D' = [d | d ∈ N] and n' = n.
 *       n' = SUM(D'[i] * b^i), where i ∈ N and i < |D'|
 *          = (D'[0] * b^0) + (D'[1] * b^1) + ... + (D'[|D'|-1] * b^(|D'|-1))
 *          = ((D[0] + q[0] * b) * b^0) + (D'[1] * b^1) + ... + (D'[|D'|-1] * b^(|D'|-1)), where q[0] = floor(D'[0] / b)
 *          = (D[0] * b^0) + (q[0] * b^1) + (D'[1] * b^1) + ... + (D'[|D'|-1] * b^(|D'|-1))
 *          = (D[0] * b^0) + ((q[0] + D'[1]) * b^1) + ... + (D'[|D'|-1] * b^(|D'|-1))
 *          = (D[0] * b^0) + ((D[1] + q[1] * b) * b^1) + ... + (D'[|D'|-1] * b^(|D'|-1)), where q[1] = floor((q[0] + D'[1]) / b)
 *          = (D[0] * b^0) + (D[1] * b^1) + (q[1] * b^2) + ... + (D'[|D'|-1] * b^(|D'|-1))
 *          = ...
 *          = (D[0] * b^0) + (D[1] * b^1) + ... + (q[j-1] * b^(j-1)) + (D'[j-1] * b^(j-1)) + ..., where j ∈ N and 0 < j < |D|
 *          = (D[0] * b^0) + (D[1] * b^1) + ... + ((D'[j-1] + q[j-1]) * b^(j-1)) + ...
 *          = (D[0] * b^0) + (D[1] * b^1) + ... + (D[j-1] + q[j] * b) * b^(j-1) + ..., where q[j] = floor((q[j-1] + D'[j]) / b)
 *          = ...
 *          = (D[0] * b^0) + (D[1] * b^1) + ... + (D[|D|-1] * b^(|D|-1)), when j = |D| - 1
 *
 * @return {DigitArray} this
 */
DigitArray.prototype.normalize = function(){
  var carry = 0;

  for(var i = 0; carry > 0 || i < this.digits.length; i++){
    var result = Utils.divide((this.digits[i] || 0) + carry, this.base);
    this.digits[i] = result.remainder;
    carry = result.quotient;
  }

  return this;
};

/**
 * Converts the DigitArray to another base.
 *
 * Math: Let D' = [d | d ∈ N], n' = n, b' ∈ N, and b' >= 2.
 *       n' = SUM(D'[i] * b^i), where i ∈ N and i < |D'|
 *          = (D'[0] * b^0) + (D'[1] * b^1) + ... + (D'[|D'|-1] * b^(|D'|-1))
 *          = D'[0] + b' * (D'[1] + b' * (D'[2] + ... + b' * (D'[|D'|-1]) ... ))
 *          = ...
 *          = (D[0] * b^0) + (D[1] * b^1) + ... + (D[|D|-1] * b^(|D|-1))
 * 
 * @param {number} base The base use.
 *
 * @return {DigitArray} The DigitArray in the given base.
 */
DigitArray.prototype.toBase = function(base){
  Utils.checkBase(base);

  var other = new DigitArray(base);
  for(var i = this.digits.length - 1; i >= 0; i--){
    other.multiply(this.base).add(this.digits[i]);
  }

  return other;
};

/**
 * Encodes the digits as text using an alphabet substitution.
 *
 * @param {string} alphabet The alphabet to encode the digits in.
 * @param {Endianess} [endianess=Endianess.big] The endianess of the encoded digits.
 *
 * @return {string} The DigitArray encoded as text.
 */
DigitArray.prototype.encode = function(alphabet, endianess){
  Utils.checkAlphabet(this.base, alphabet);

  var digits = this.digits.map(function(digit){ return alphabet[digit]; });

  endianess = endianess || Endianess.big;
  if(endianess === Endianess.big) digits.reverse();
  
  return digits.join('');
};

/**
 * Creates a DigitArray from encoded text using an alphabet substitution.
 *
 * @param {string} text The text to decode.
 * @param {number} base The base the DigitArray was encoded in.
 * @param {string} alphabet The alphabet the DigitArray was encoded in.
 * @param {Endianess} [endianess=Endianess.big] The endianess of the encoded digits.
 *
 * @return {DigitArray} The decoded DigitArray.
 */
DigitArray.decode = function(text, base, alphabet, endianess){
  Utils.checkAlphabet(base, alphabet);

  var map = {};
  alphabet.split('').forEach(function(numeral, index){ map[numeral] = index; });

  var digits = text.split('').map(function(numeral){ return map[numeral]; });

  endianess = endianess || Endianess.big;
  if(endianess === Endianess.little) digits.reverse();

  return new DigitArray(base, digits);
};

/**
 * Converts the value that a DigitArray represents to a number.
 *
 * Warning: DigitArrays representing values greater than MAX_INT will return an
 * approximated value due to JavaScript's implementation of the number type.
 * 
 * @return {number} The value of the DigitArray.
 */
DigitArray.prototype.toNumber = function(){
  var number = 0;

  for(var i = this.digits.length - 1; i >= 0; i--){
    number = (number * this.base) + this.digits[i];
  }

  
  return number;
};

module.exports = DigitArray;

},{"./endianess":1,"./utils":4}],3:[function(require,module,exports){
// The largest integer that can be uniquely represented by JavaScript's number type.
var MAX_INT = Math.pow(2, 53) - 1;

// The smallest integer base that is practical for encoding values.
var MIN_BASE = 2;

// The largest integer that will not exceed MAX_INT during multiplication with itself.
var MAX_BASE = Math.floor(Math.sqrt(MAX_INT));

module.exports = {
  MAX_INT: MAX_INT,
  MIN_BASE: MIN_BASE,
  MAX_BASE: MAX_BASE
};

},{}],4:[function(require,module,exports){
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
}

/**
 * Throw an error if the alphabet size is smaller than the base size.
 *
 * @param {number} base The base size to check.
 */
var checkAlphabet = function(base, alphabet){
  if(alphabet.length < base) throw('Alphabet must contain at least ' + base + ' numerals.');
}

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
}

module.exports = {
  checkBase: checkBase,
  checkAlphabet: checkAlphabet,
  divide: divide
};

},{"./limit":3}]},{},[2])