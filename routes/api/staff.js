const express = require("express");
const router = express.Router();
const {
  PRIVILEGES,
  ROLES,
} = require("../../common/constants/rolesAndPrivileges");
const { verifyToken } = require("../../common/middlewares/authentication");

const {
  createStaff,
  getAllBusinessStaff,
  updateStaff,
  deleteStaff,
  getStaff,
} = require("../../common/middlewares/handlers/staff");
const {
  createStaffValidations,
  updateStaffValidations,
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
  "/:businessUuid",
  verifyToken(),
  // verifyToken(
  //   [PRIVILEGES.ALL, PRIVILEGES.ADD_BUSINESS],
  //   [ROLES.ADMIN, ROLES.USER]
  // ),
  updateStaffValidations,
  updateStaff
);

// get single staff
router.get(
  "/:businessUuid/:userUuid",
  verifyToken(),
  // verifyToken(
  //   [PRIVILEGES.ALL, PRIVILEGES.ADD_BUSINESS],
  //   [ROLES.ADMIN, ROLES.USER]
  // ),
  getStaff
);

// delete staff
router.delete(
  "/:businessUuid/:userUuid",
  verifyToken(),
  // verifyToken(
  //   [PRIVILEGES.ALL, PRIVILEGES.ADD_BUSINESS],
  //   [ROLES.ADMIN, ROLES.USER]
  // ),
  deleteStaff
);

module.exports = router;
