// The largest integer that can be uniquely represented by JavaScript's number type.
var MAX_INT = Math.pow(2, 53) - 1;

// The smallest integer base that is practical for encoding values.
var MIN_BASE = 2;

// The largest integer that will not exceed MAX_INT during multiplication with itself.
var MAX_BASE = Math.floor(Math.sqrt(MAX_INT));
