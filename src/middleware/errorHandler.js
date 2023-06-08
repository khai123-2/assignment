const logger = require('../logging/logger');
const Log = require('../models/log.model');
const errorHandler = async (err, req, res, _next) => {
  console.log('ERROR LOG ', new Date().toLocaleString());
  console.log('Request:', req.method, req.originalUrl);
  console.log('Params:', req.params);
  console.log('Body:', req.body);
  console.log('Query:', req.query);
  console.log('Error: ', err);
  console.log('Error stack: ', err.stack);
  console.log('--------------------------------------------------------------------------------------');

  const messageError = err.messageObject || err.message;
  // create format error response
  const error = {
    status: 'Error',
    error: messageError,
  };
  const status = err.status || 400;
  let logError = {
    level: 'error',
    user: req.user?.lastName || 'Unknown user',
    message: messageError,
  };
  if (status === 422) {
    logError = { ...logError, level: 'warn' };
  }
  await Log.create(logError);

  logger.error(messageError);
  return res.status(status).json(error);
};

module.exports = errorHandler;
