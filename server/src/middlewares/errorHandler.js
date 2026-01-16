const { sendError } = require('../utils/response');

const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  if (err.isJoi) {
    const message = err.details.map(d => d.message).join(', ');
    return sendError(res, message, 400);
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Error interno del servidor';

  sendError(res, message, statusCode, err);
};

module.exports = errorHandler;