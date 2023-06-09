const { ValidationError } = require('../error/errorsException');
const validate = (schema) => {
  return (req, _res, next) => {
    try {
      const { error, value } = schema.validate(req.body);
      if (error) {
        throw new ValidationError(error.details[0].message);
      }
      req.body = value;
      next();
    } catch (err) {
      next(err);
    }
  };
};

module.exports = validate;
