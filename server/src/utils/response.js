const sendSuccess = (res, data, message = 'Operación exitosa', statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    timestamp: new Date().toISOString()
  });
};

const sendError = (res, message = 'Error en el servidor', statusCode = 500, error = null) => {
  return res.status(statusCode).json({
    success: false,
    message,
    error: process.env.NODE_ENV === 'development' ? error : undefined,
    timestamp: new Date().toISOString()
  });
};

module.exports = { sendSuccess, sendError };