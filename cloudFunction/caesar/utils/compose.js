function compose(...fns) {
  function accumulator(count, args) {
    return count < 0 ? args : accumulator(count - 1, fns[count](args));
  }

  return function (...args) {
    return accumulator(fns.length - 1, ...args);
  };
}

module.exports = { compose };
