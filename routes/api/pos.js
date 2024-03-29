const express = require("express");
const router = express.Router();
const { PRIVILEGES, ROLES } = require("../../common/constants/rolesAndPrivileges");
const { verifyToken } = require("../../common/middlewares/authentication");

const {
  getAllBusinessCategoriesAndItems,
  createUpdateLiveCartItem,
  getLiveCartByZoneOrTable,
  deleteCartItem,
  updateCartItemStatus,
  getAllCartsByZone,
  settlementHandler,
  confirmCartHandler,
} = require("../../common/middlewares/handlers/pos");
const {
  createUpdateCartItemValidations,
  updatecartItemStatusValidations,
  settlementValidations,
} = require("../../common/middlewares/validations/pos/pos");

// get all business categories and items with meta data (subcategory and item, addons, portion)
// ?categoryUuid=all/root/`uuid`
router.get("/:businessUuid", verifyToken(), getAllBusinessCategoriesAndItems);

// settle live cart
router.post(
  "/:businessUuid/settle",
  verifyToken(),
  settlementValidations,
  settlementHandler
);
router.put(
  "/:businessUuid/confirm/:cartUuid",
  verifyToken(),
  confirmCartHandler
);
// create/update live cart
router.post(
  "/:businessUuid",
  verifyToken(),
  createUpdateCartItemValidations,
  createUpdateLiveCartItem
);
router.delete("/:businessUuid/:cartItemUuid", verifyToken(), deleteCartItem);
router.put(
  "/:businessUuid/:cartItemUuid",
  verifyToken(),
  updatecartItemStatusValidations,
  updateCartItemStatus
);
router.get("/:businessUuid/:zoneUuid/carts", verifyToken(), getAllCartsByZone);

//  ?cartUuid
router.get("/:businessUuid/:zoneUuid/:tableUuid", verifyToken(), getLiveCartByZoneOrTable);

module.exports = router;
