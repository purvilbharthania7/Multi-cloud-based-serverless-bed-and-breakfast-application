function guard(x, y, z) {
  return function (...args) {
    return z.apply(z, args) ? y.apply(y, args) : x.apply(x, args);
  };
}

module.exports = { guard };
