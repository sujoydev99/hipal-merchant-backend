const jwt = require("jsonwebtoken");
const { getBusinessMetaByUuidUserId } = require("../../repository/business");
const { getUserByUuid, getUserByUuidReq } = require("../../repository/user");
const {
  FORBIDDENED,
  JWT_EXPIRED,
  INSUFFICIENT_PRIVILEGES,
  INSUFFICIENT_ROLES,
  NOT_ALLOWED,
  NOT_FOUND,
} = require("../constants/messages");
const { PRIVILEGES, ROLES } = require("../constants/rolesAndPrivileges");
exports.verifyToken = (privileges = [], roles = []) => {
  return async (req, res, next) => {
    try {
      let user = null;
      let token = req.headers["authorization"]
        ? req.headers["authorization"]
        : req.headers["Authorization"];
      if (null === token) {
        throw FORBIDDENED;
      }
      try {
        userJwt = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
      } catch (error) {
        throw JWT_EXPIRED;
      }
      if (req.params.userUuid && req.params.userUuid !== userJwt.uuid)
        throw NOT_ALLOWED;
      if (userJwt) {
        user = await getUserByUuidReq(userJwt.uuid);
        req.user = JSON.parse(JSON.stringify(user));
      }
      if (req.params.businessUuid) {
        const { businessUuid } = req.params;
        const business = await getBusinessMetaByUuidUserId(
          businessUuid,
          req.user.id
        );
        if (!business) throw NOT_FOUND;
        req.business = business;
      }
      next();
    } catch (error) {
      console.log(error);
      next(error);
    }
  };
};

function allowedPrivilegesAndRoles(a1, a2) {
  return a1.filter(function (n) {
    return a2.indexOf(n) !== -1;
  });
}
