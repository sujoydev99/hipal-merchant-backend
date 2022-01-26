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
  createStaff,
  getAllBusinessStaff,
} = require("../../common/middlewares/handlers/staff");
const {
  createUpdateRoleValidations,
} = require("../../common/middlewares/validations/role/role");
const {
  createStaffValidations,
} = require("../../common/middlewares/validations/staff/staff");

// get all business staff
router.get("/:businessUuid", verifyToken(), getAllBusinessStaff);

// create staff
router.post(
  "/:businessUuid",
  verifyToken(),
  // verifyToken(
  //   [PRIVILEGES.ALL, PRIVILEGES.ADD_BUSINESS],
  //   [ROLES.ADMIN, ROLES.USER]
  // ),
  createStaffValidations,
  createStaff
);

// update staff
router.put(
  "/:businessUuid/:userUuid",
  verifyToken(),
  // verifyToken(
  //   [PRIVILEGES.ALL, PRIVILEGES.ADD_BUSINESS],
  //   [ROLES.ADMIN, ROLES.USER]
  // ),
  createUpdateRoleValidations,
  updateRole
);

// get single staff
router.get(
  "/:businessUuid/:userUuid",
  verifyToken(),
  // verifyToken(
  //   [PRIVILEGES.ALL, PRIVILEGES.ADD_BUSINESS],
  //   [ROLES.ADMIN, ROLES.USER]
  // ),
  getRole
);

// delete staff
router.delete(
  "/:businessUuid/:staffUuid",
  verifyToken(),
  // verifyToken(
  //   [PRIVILEGES.ALL, PRIVILEGES.ADD_BUSINESS],
  //   [ROLES.ADMIN, ROLES.USER]
  // ),
  deleteRole
);

module.exports = router;
