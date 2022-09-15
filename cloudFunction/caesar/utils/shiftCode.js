function isLowerCase(x) {
    return x >= 97 && x <= 122;
  }
  
  function isUpperCase(x) {
    return x >= 65 && x <= 90;
  }
  
  function isAlpha(x) {
    return isLowerCase(x) || isUpperCase(x);
  }
  
  function shiftCode(key, code) {
    if (!isAlpha(code)) {
      throw new TypeError("Expected an alphabetical code");
    }
  
    const constraint = isUpperCase(code) ? 65 : 97;
    return ((code - constraint + key) % 26) + constraint;
  }
  module.exports = { isAlpha, isLowerCase, isUpperCase, shiftCode };