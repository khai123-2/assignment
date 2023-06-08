require("dotenv").config();
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const Employee = require("../models/employee.model");
const Role = require("../models/role.model");
const UnauthorizedError = require("../error/UnauthorizedError");

module.exports = async (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");
    const accessTokenFromHeader = authHeader && authHeader.split(" ")[1];
    if (!accessTokenFromHeader) {
      throw new UnauthorizedError("Token not found");
    }
    const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
    const verified = jwt.verify(accessTokenFromHeader, accessTokenSecret);
    if (!verified) {
      throw new UnauthorizedError("Token doesn't exists");
    }
    const { payload } = verified;
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
