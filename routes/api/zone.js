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
  createZone,
  updateZone,
  getZone,
  deleteZone,
  getAllBusinessZones,
} = require("../../common/middlewares/handlers/zone");
const {
  createUpdateRoleValidations,
} = require("../../common/middlewares/validations/role/role");
const {
  createUpdateZoneValidations,
} = require("../../common/middlewares/validations/zone/zone");

// get all business zone
router.get("/:businessUuid", verifyToken(), getAllBusinessZones);

// create business zone
router.post(
  "/:businessUuid",
  verifyToken(),
  // verifyToken(
  //   [PRIVILEGES.ALL, PRIVILEGES.ADD_BUSINESS],
  //   [ROLES.ADMIN, ROLES.USER]
  // ),
  createUpdateZoneValidations,
  createZone
);
// update business zone
router.put(
  "/:businessUuid/:zoneUuid",
  verifyToken(),
  // verifyToken(
  //   [PRIVILEGES.ALL, PRIVILEGES.ADD_BUSINESS],
  //   [ROLES.ADMIN, ROLES.USER]
  // ),
  createUpdateZoneValidations,
  updateZone
);

// get single zone
router.get(
  "/:businessUuid/:zoneUuid",
  verifyToken(),
  // verifyToken(
  //   [PRIVILEGES.ALL, PRIVILEGES.ADD_BUSINESS],
  //   [ROLES.ADMIN, ROLES.USER]
  // ),
  getZone
);

// delete zone
router.delete(
  "/:businessUuid/:zoneUuid",
  verifyToken(),
  // verifyToken(
  //   [PRIVILEGES.ALL, PRIVILEGES.ADD_BUSINESS],
  //   [ROLES.ADMIN, ROLES.USER]
  // ),
  deleteZone
);

module.exports = router;
