const validateRequest = (schema, source = 'body') => {
  return (req, res, next) => {
    const data = req[source];
    const { error, value } = schema.validate(data, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const message = error.details.map(d => d.message).join(', ');
      return res.status(400).json({
        success: false,
        message,
        errors: error.details
      });
    }

    req[source] = value;
    next();
  };
};

module.exports = validateRequest;