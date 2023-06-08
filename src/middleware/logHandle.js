const logger = require('../logging/logger');
const Log = require('../models/log.model');
const logHandle = async (req, res, next) => {
  const { url, method } = req;
  const reqData = {
    level: 'info',
    message: {
      header: JSON.stringify(req.headers),
      body: req.body,
      method,
      url,
    },
  };

  await Log.create(reqData);
  logger.info({
    message: 'Request',
    url,
    method,
  });

  res.on('finish', async () => {
    const resData = {
      level: 'info',
      user: req.user?.lastName || 'Unknown user',
      message: {
        statusCode: res?.statusCode,
        method,
        url,
      },
    };
    await Log.create(resData);
    logger.info({
      message: 'Response',
      method,
      url,
      statusCode: res.statusCode,
    });
  });

  next();
};
module.exports = logHandle;
