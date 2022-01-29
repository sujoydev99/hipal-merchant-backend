const express = require("express");
const router = express.Router();
const {
  PRIVILEGES,
  ROLES,
} = require("../../common/constants/rolesAndPrivileges");
const { verifyToken } = require("../../common/middlewares/authentication");
const {
  getAllBusinessTablesByZone,
  createTable,
  updateTable,
  getTable,
  deleteTable,
} = require("../../common/middlewares/handlers/table");
const {
  createUpdateTableValidations,
} = require("../../common/middlewares/validations/table/table");

// get all tables by business and zone, with order details
router.get(
  "/:businessUuid/:zoneUuid",
  verifyToken(),
  getAllBusinessTablesByZone
);

// create table
router.post(
  "/:businessUuid/:zoneUuid",
  verifyToken(),
  // verifyToken(
  //   [PRIVILEGES.ALL, PRIVILEGES.ADD_BUSINESS],
  //   [ROLES.ADMIN, ROLES.USER]
  // ),
  createUpdateTableValidations,
  createTable
);
// update table
router.put(
  "/:businessUuid/:zoneUuid/:tableUuid",
  verifyToken(),
  // verifyToken(
  //   [PRIVILEGES.ALL, PRIVILEGES.ADD_BUSINESS],
  //   [ROLES.ADMIN, ROLES.USER]
  // ),
  createUpdateTableValidations,
  updateTable
);

// get single table with order details
router.get(
  "/:businessUuid/:zoneUuid/:tableUuid",
  verifyToken(),
  // verifyToken(
  //   [PRIVILEGES.ALL, PRIVILEGES.ADD_BUSINESS],
  //   [ROLES.ADMIN, ROLES.USER]
  // ),
  getTable
);

// delete zone
router.delete(
  "/:businessUuid/:zoneUuid/:tableUuid",
  verifyToken(),
  // verifyToken(
  //   [PRIVILEGES.ALL, PRIVILEGES.ADD_BUSINESS],
  //   [ROLES.ADMIN, ROLES.USER]
  // ),
  deleteTable
);

module.exports = router;
