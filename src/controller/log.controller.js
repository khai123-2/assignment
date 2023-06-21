const Log = require('@/database/models/log.model');

const getLogs = async (req, res, next) => {
  try {
    const { level, user, fromDate, endDate } = req.query;
    const query = {};

    if (level) {
      query.level = level;
    }

    if (user) {
      query.user = user;
    }

    if (fromDate) {
      query.createdAt = {
        $gte: fromDate,
      };
    }
    if (endDate) {
      query.createdAt = {
        ...query.createdAt,
        $lte: endDate,
      };
    }
    console.log(query);
    const logs = await Log.find(query);
    return res.status(200).send({ data: logs });
  } catch (err) {
    next();
  }
};

module.exports = {
  getLogs,
};
