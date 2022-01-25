const express = require("express");
const router = express.Router();
const {
  PRIVILEGES,
  ROLES,
} = require("../../common/constants/rolesAndPrivileges");
const { verifyToken } = require("../../common/middlewares/authentication");

const {
  getAllAvailablePrivileges,
  createRole,
  updateRole,
  getRole,
  getAllBusinessRoles,
  deleteRole,
} = require("../../common/middlewares/handlers/role");
const {
  createUpdateRoleValidations,
} = require("../../common/middlewares/validations/role/role");

// get all available privileges
router.get("/allAvailable", getAllAvailablePrivileges);

// get all business roles
router.get("/:businessUuid", verifyToken(), getAllBusinessRoles);

// create business role
router.post(
  "/:businessUuid",
  verifyToken(),
  // verifyToken(
  //   [PRIVILEGES.ALL, PRIVILEGES.ADD_BUSINESS],
  //   [ROLES.ADMIN, ROLES.USER]
  // ),
  createUpdateRoleValidations,
  createRole
);
// update business role
router.post(
  "/:businessUuid/:roleUuid",
  verifyToken(),
  // verifyToken(
  //   [PRIVILEGES.ALL, PRIVILEGES.ADD_BUSINESS],
  //   [ROLES.ADMIN, ROLES.USER]
  // ),
  createUpdateRoleValidations,
  updateRole
);

// get single business role
router.get(
  "/:businessUuid/:roleUuid",
  verifyToken(),
  // verifyToken(
  //   [PRIVILEGES.ALL, PRIVILEGES.ADD_BUSINESS],
  //   [ROLES.ADMIN, ROLES.USER]
  // ),
  getRole
);
router.get(
  "/:businessUuid/:roleUuid",
  verifyToken(),
  // verifyToken(
  //   [PRIVILEGES.ALL, PRIVILEGES.ADD_BUSINESS],
  //   [ROLES.ADMIN, ROLES.USER]
  // ),
  getRole
);
router.delete(
  "/:businessUuid/:roleUuid",
  verifyToken(),
  // verifyToken(
  //   [PRIVILEGES.ALL, PRIVILEGES.ADD_BUSINESS],
  //   [ROLES.ADMIN, ROLES.USER]
  // ),
  deleteRole
);

module.exports = router;
