class UsageError extends Error {
  constructor(message) {
    super(message);
  }
}

UsageError.prototype.name = 'UsageError';

module.exports = UsageError;
