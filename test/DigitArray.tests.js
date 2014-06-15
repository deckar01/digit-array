var chai = require('chai');
var expect = chai.expect;

var DigitArray = require('../src/DigitArray');

describe('DigitArray', function(){
  describe('constructor', function(){
    it('should create new DigitArrays', function(){
      var digitArray = new DigitArray(2, [1]);

      expect(digitArray).to.be.an.instanceOf(DigitArray);
      expect(digitArray.digits).to.deep.equal([1]);
    });
  });
});