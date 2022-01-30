const express = require("express");
const router = express.Router();
const {
  PRIVILEGES,
  ROLES,
} = require("../../common/constants/rolesAndPrivileges");
const { verifyToken } = require("../../common/middlewares/authentication");
const {
  deleteStation,
  getStation,
  updateStation,
  createStation,
  getAllBusinessStations,
} = require("../../common/middlewares/handlers/station");

const {
  createUpdateStationdations,
} = require("../../common/middlewares/validations/station/station");

// get all business zone
router.get("/:businessUuid", verifyToken(), getAllBusinessStations);

// create business zone
router.post(
  "/:businessUuid",
  verifyToken(),
  // verifyToken(
  //   [PRIVILEGES.ALL, PRIVILEGES.ADD_BUSINESS],
  //   [ROLES.ADMIN, ROLES.USER]
  // ),
  createUpdateStationdations,
  createStation
);
// update business zone
router.put(
  "/:businessUuid/:stationUuid",
  verifyToken(),
  // verifyToken(
  //   [PRIVILEGES.ALL, PRIVILEGES.ADD_BUSINESS],
  //   [ROLES.ADMIN, ROLES.USER]
  // ),
  createUpdateStationdations,
  updateStation
);

// get single zone
router.get(
  "/:businessUuid/:stationUuid",
  verifyToken(),
  // verifyToken(
  //   [PRIVILEGES.ALL, PRIVILEGES.ADD_BUSINESS],
  //   [ROLES.ADMIN, ROLES.USER]
  // ),
  getStation
);

// delete zone
router.delete(
  "/:businessUuid/:stationUuid",
  verifyToken(),
  // verifyToken(
  //   [PRIVILEGES.ALL, PRIVILEGES.ADD_BUSINESS],
  //   [ROLES.ADMIN, ROLES.USER]
  // ),
  deleteStation
);

module.exports = router;
