const express = require("express");
const router = express.Router();
const {
  PRIVILEGES,
  ROLES,
} = require("../../common/constants/rolesAndPrivileges");
const { verifyToken } = require("../../common/middlewares/authentication");
const {
  createItem,
  updateItem,
  getAllBusinessItems,
  getItem,
  deleteItem,
  deletePortion,
  createPortion,
} = require("../../common/middlewares/handlers/item");

const {
  createUpdateItemValidations,
  createUpdatePortionValidations,
} = require("../../common/middlewares/validations/item/item");

// get all business items
router.get("/:businessUuid", verifyToken(), getAllBusinessItems);

// create business items
router.post(
  "/:businessUuid",
  verifyToken(),
  // verifyToken(
  //   [PRIVILEGES.ALL, PRIVILEGES.ADD_BUSINESS],
  //   [ROLES.ADMIN, ROLES.USER]
  // ),
  createUpdateItemValidations,
  createItem
);
// update business item
router.put(
  "/:businessUuid/:itemUuid",
  verifyToken(),
  // verifyToken(
  //   [PRIVILEGES.ALL, PRIVILEGES.ADD_BUSINESS],
  //   [ROLES.ADMIN, ROLES.USER]
  // ),
  createUpdateItemValidations,
  updateItem
);

// get single item
router.get(
  "/:businessUuid/:itemUuid",
  verifyToken(),
  // verifyToken(
  //   [PRIVILEGES.ALL, PRIVILEGES.ADD_BUSINESS],
  //   [ROLES.ADMIN, ROLES.USER]
  // ),
  getItem
);

// delete item
router.delete(
  "/:businessUuid/:itemUuid",
  verifyToken(),
  // verifyToken(
  //   [PRIVILEGES.ALL, PRIVILEGES.ADD_BUSINESS],
  //   [ROLES.ADMIN, ROLES.USER]
  // ),
  deleteItem
);

// create serving
router.post(
  "/:businessUuid/:itemUuid/portion",
  verifyToken(),
  // verifyToken(
  //   [PRIVILEGES.ALL, PRIVILEGES.ADD_BUSINESS],
  //   [ROLES.ADMIN, ROLES.USER]
  // ),
  createUpdatePortionValidations,
  createPortion
);

// delete serving size
router.delete(
  "/:businessUuid/:itemUuid/portion/:portionUuid",
  verifyToken(),
  // verifyToken(
  //   [PRIVILEGES.ALL, PRIVILEGES.ADD_BUSINESS],
  //   [ROLES.ADMIN, ROLES.USER]
  // ),
  deletePortion
);
module.exports = router;