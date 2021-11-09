const { NO_TOKEN, INSUFFICIENT_ROLES_ERROR } = require("../constants/messages");
const { ALL } = require("../constants/privileges");

exports.authenticate = (req, res, next) => {
  try {
    const bearerHeader = req.header("Authorization");
    if (!bearerHeader) throw NO_TOKEN;
    const bearer = bearerHeader.split(" ");
    const token = bearer[1];
    if (!token) return NO_TOKEN;
    else {
      const decoded = jwt.verify(token, jwtPrivateKey);
      req.user = decoded;
      next();
    }
  } catch (error) {
    next(error);
  }
};
exports.verifyRole = (roles = []) => {
  return async (req, res, next) => {
    try {
      if (roles.includes(ALL)) {
        next();
        return;
      }
      if (!req.user.roles.includes(roles)) throw INSUFFICIENT_ROLES_ERROR;
    } catch (error) {
      next(error);
    }
  };
};
