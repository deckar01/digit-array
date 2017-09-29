var chai = require('chai');
var expect = chai.expect;

var DigitArray = require('../src/DigitArray');

var baseTables = [];
for(var base = 2; base <= 100; base++) {
  baseTables[base] = require('./data/base' + base + '.json');
}

describe('DigitArray', function(){
  describe('constructor', function(){
    it('should create new instances of DigitArray', function(){
      var digitArray = new DigitArray(2, [1]);

      expect(digitArray).to.be.an.instanceOf(DigitArray);
      expect(digitArray.base).to.deep.equal(2);
      expect(digitArray.digits).to.deep.equal([1]);
    });

    it('should default digits to [0]', function(){
      var digitArray = new DigitArray(2);

      expect(digitArray.digits).to.deep.equal([0]);
    });

    it('should default endianess to big', function(){
      var digitArray = new DigitArray(4, [3, 2, 1, 0]);

      expect(digitArray.digits).to.deep.equal([0, 1, 2, 3]);
    });

    it('should initialize digits from a number', function(){
      var digitArray = new DigitArray(2, 23);

      expect(digitArray.digits).to.deep.equal([1, 1, 1, 0, 1]);
    });

    it('should accept a little endian array of digits', function(){
      var digitArray = new DigitArray(2, [1, 1, 1, 0, 1], 'little');

      expect(digitArray.digits).to.deep.equal([1, 1, 1, 0, 1]);
    });
  });

  describe('toBase()', function(){
    for(var _oldBase = 100; _oldBase >= 2; _oldBase--){
      var oldBase = _oldBase;
      var oldBaseTable = baseTables[oldBase];

      it('should convert from bases ' + oldBase, function(){
        for(var newBase = 2; newBase <= 100; newBase++){
          var newBaseTable = baseTables[newBase];

          for(var i = 0; i < 10; i++){
            var value = Math.floor(Math.random() * 1000); // [0, 999]

            var oldDigitArray = new DigitArray(oldBase, oldBaseTable[value]);
            var newDigitArray = oldDigitArray.toBase(newBase);

            expect(newDigitArray.digits).to.deep.equal(newBaseTable[value].slice().reverse());
          }
        }
      });
    }
  });
});