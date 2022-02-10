const express = require("express");
const router = express.Router();
const { PRIVILEGES, ROLES } = require("../../common/constants/rolesAndPrivileges");
const { verifyToken } = require("../../common/middlewares/authentication");

const {
  getAllBusinessCategoriesAndItems,
  createUpdateLiveCartItem,
  getLiveCartByZoneOrTable,
  getAllOutOrders,
} = require("../../common/middlewares/handlers/pos");
const { createUpdateCartItemValidations } = require("../../common/middlewares/validations/pos/pos");

// get all business categories and items with meta data (subcategory and item, addons, portion)
router.get("/:businessUuid", verifyToken(), getAllBusinessCategoriesAndItems);
// create/update live cart
router.post(
  "/:businessUuid",
  verifyToken(),
  createUpdateCartItemValidations,
  createUpdateLiveCartItem
);

router.get("/:businessUuid/:zoneUuid", verifyToken(), getAllOutOrders);

// get all liveCart data by zoneId and tableId or outOrderId
router.get("/:businessUuid/:zoneUuid/:tableUuid", verifyToken(), getLiveCartByZoneOrTable);

module.exports = router;
