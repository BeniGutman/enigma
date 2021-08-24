const { validationResult } = require('express-validator/check');

exports.validateRequest = (func) => {
  const validator = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error('Validation failed.');
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }
    return func(req, res, next);
  };
  return validator;
};
