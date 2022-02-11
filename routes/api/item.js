const express = require("express");
const router = express.Router();
const { PRIVILEGES, ROLES } = require("../../common/constants/rolesAndPrivileges");
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
router.post("/:businessUuid", verifyToken(), createUpdateItemValidations, createItem);
// update business item
router.put("/:businessUuid/:itemUuid", verifyToken(), createUpdateItemValidations, updateItem);

// get single item
router.get("/:businessUuid/:itemUuid", verifyToken(), getItem);

// delete item
router.delete("/:businessUuid/:itemUuid", verifyToken(), deleteItem);

// create serving
router.post(
  "/:businessUuid/:itemUuid/portion",
  verifyToken(),
  createUpdatePortionValidations,
  createPortion
);

// delete serving size
router.delete("/:businessUuid/:itemUuid/portion/:portionUuid", verifyToken(), deletePortion);

module.exports = router;
