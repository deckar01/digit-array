## DigitArray

The DigitArray library is designed to encode and decode numbers in arbirtary bases.

### Example

```javascript
var decimalValue = new DigitArray(10, [1, 3, 3, 7]);

var binaryValue = decimalValue.toBase(2);

var hexValue = decimalValue.toBase(16);

var encodedDecimalValue = decimalValue.encode('0123456789');
// "1337"

var encodedBinaryValue = binaryValue.encode('01');
// "10100111001"

var encodedHexValue = hexValue.encode('0123456789abcdef');
// "539"

DigitArray.decode(encodedDecimalValue, 10, '0123456789').toNumber();
// 1337

DigitArray.decode(encodedBinaryValue, 2, '01').toNumber();
// 1337

DigitArray.decode(encodedHexValue, 16, '0123456789abcdef').toNumber();
// 1337
```

### Dev setup

Requirements:

 - npm
 - gulp

Install dependencies:

```bash
npm install -g gulp
npm install
```

Build library:

Modify the source files in the ```src``` directory, then run gulp to build ```DigitArray.js``` and ```DigitArray.min.js``` in the root directory.

```bash
gulp
```
