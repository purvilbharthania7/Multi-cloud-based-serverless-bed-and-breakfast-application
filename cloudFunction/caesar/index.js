const { guard } = require("./utils/guard");
const { compose } = require("./utils/compose");
const { shiftCode, isAlpha } = require("./utils/shiftCode");

function join(x, xs) {
  return xs.join(x);
}

function map(x, xs) {
  return xs.map(x);
}

function split(x, y) {
  return y.split(x);
}

function identity(x) {
  return x;
}
function codeToChar(x) {
  return String.fromCharCode(x);
}

function charToCode(char) {
  return char.charCodeAt(0);
}

function encrypt(key, message) {
  if (key < 0) {
    throw new TypeError("Expected key to be a non-negative number");
  }
  const shift = guard(identity, shiftCode.bind(shiftCode, key), isAlpha);
  const encode = compose(codeToChar, shift, charToCode);
  return join("", map(encode, split("", message)));
}

module.exports = { encrypt };