const jwt = require("jsonwebtoken");
const { getUserById } = require("../../repository/user");
exports.verifyToken = async (req, res, next) => {
  try {
    let token = req.headers["authorization"]
      ? req.headers["authorization"]
      : req.headers["Authorization"];
    if (null == token) {
      throw { statusCode: 403, message: "forbiddened" };
    }
    let userJwt = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
    if (null != (userUuid = userJwt ? userJwt.uuid : null)) {
      user = await getUserByUuid(userUuid);
      req.user = user;
    }
    next();
  } catch (error) {
    next(error);
  }
};
