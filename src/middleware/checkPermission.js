const UnauthorizedError = require("../error/UnauthorizedError");

const checkPermissions = (validPermissions) => {
  return (req, _res, next) => {
    try {
      const roleUser = req.user.Role.role;
      const found = validPermissions.includes(roleUser);
      if (found) {
        next();
      } else {
        throw new UnauthorizedError(roleUser + " doesn't  have permission");
      }
    } catch (err) {
      next(err);
    }
  };
};

module.exports = checkPermissions;
