module.exports = (schema, property = 'body') => {
  return (req, res, next) => {
    
    const { error, value } = schema.validate(req[property], { abortEarly: false });

    if (error) {
      const errors = {};
      error.details.forEach(detail => {
        errors[detail.path[0]] = detail.message;
      });

      return res.status(400).json({
        success: false,
        message: 'Errores de validación',
        errors
      });
    }

    req[property] = value;
    next();
  };
};