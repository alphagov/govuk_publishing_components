try {
  module.exports = require('jasmine-core');
} catch (e) {
  if (e.code === 'MODULE_NOT_FOUND') {
    throw new Error(
      "Could not load jasmine-core. Please make sure that it's installed."
    );
  } else {
    throw e;
  }
}
