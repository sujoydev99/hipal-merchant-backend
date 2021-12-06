const jwt = require("jsonwebtoken");
const { getUserByUuid, getUserByUuidReq } = require("../../repository/user");
const {
  FORBIDDENED,
  JWT_EXPIRED,
  INSUFFICIENT_PRIVILEGES,
  INSUFFICIENT_ROLES,
  NOT_ALLOWED,
} = require("../constants/messages");
const { PRIVILEGES, ROLES } = require("../constants/rolesAndPrivileges");
exports.verifyToken = (privileges = [], roles = []) => {
  return async (req, res, next) => {
    try {
      let user = null;
      let token = req.headers["authorization"]
        ? req.headers["authorization"]
        : req.headers["Authorization"];
      if (null == token) {
        throw FORBIDDENED;
      }
      try {
        userJwt = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
      } catch (error) {
        console.log(error);
        throw JWT_EXPIRED;
      }
      if (userJwt) {
        user = await getUserByUuidReq(userJwt.uuid);
        req.user = JSON.parse(JSON.stringify(user));
      }
      var arr = user.userTypes;
      var index = arr.indexOf(ROLES.USER);
      if (index !== -1) {
        arr.splice(index, 1);
      }
      console.log(
        roles,
        req.user.userTypes,
        allowedPrivilegesAndRoles(roles, req.user.userTypes)
      );
      if (
        roles.length > 0 &&
        allowedPrivilegesAndRoles(roles, req.user.userTypes).length === 0
      )
        throw INSUFFICIENT_ROLES;
      if (
        privileges.length > 0 &&
        allowedPrivilegesAndRoles(privileges, req.user.privileges).length === 0
      )
        throw INSUFFICIENT_PRIVILEGES;
      if (req.user.uuid === req.params.userUuid) {
        return next();
      } else if (allowedPrivilegesAndRoles(arr, roles).length > 0) {
        req.other = await getUserByUuidReq(req.params.userUuid);
        req.otherId = req.other.id;
        return next();
      } else throw INSUFFICIENT_ROLES;
      s;
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
