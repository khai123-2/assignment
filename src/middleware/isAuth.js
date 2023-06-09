require('dotenv').config();
const User = require('@/database/models/user.model');
const Employee = require('@/database/models/employee.model');
const Role = require('@/database/models/role.model');
const { verifyToken } = require('@/auth/auth.method');
const { UnauthorizedError } = require('@/error/errorsException');

module.exports = async (req, _res, next) => {
  try {
    const authHeader = req.header('Authorization');
    const accessTokenFromHeader = authHeader && authHeader.split(' ')[1];
    if (!accessTokenFromHeader) {
      throw new UnauthorizedError('Token not found');
    }
    const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
    const { error, verifyData } = verifyToken(accessTokenFromHeader, accessTokenSecret);
    if (error) {
      throw new UnauthorizedError("Token doesn't exists");
    }
    const { payload } = verifyData;
    const user = await User.findByPk(payload.username, {
      include: {
        model: Employee,
        include: {
          model: Role,
        },
      },
    });
    req.user = user.Employee;
    next();
  } catch (err) {
    next(err);
  }
};
