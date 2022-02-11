const express = require("express");
const router = express.Router();
const { PRIVILEGES, ROLES } = require("../../common/constants/rolesAndPrivileges");
const { verifyToken } = require("../../common/middlewares/authentication");

const {
  getAllBusinessCategoriesAndItems,
  createUpdateLiveCartItem,
  getLiveCartByZoneOrTable,
  getAllOutOrders,
  deleteCartItem,
  updateCartItemStatus,
} = require("../../common/middlewares/handlers/pos");
const {
  createUpdateCartItemValidations,
  updatecartItemStatusValidations,
} = require("../../common/middlewares/validations/pos/pos");

// get all by tickets zone
router.get("/:businessUuid/:stationId", verifyToken(), getAllBusinessCategoriesAndItems);
// create/update live cart
router.post(
  "/:businessUuid",
  verifyToken(),
  createUpdateCartItemValidations,
  createUpdateLiveCartItem
);

router.get("/:businessUuid/:zoneUuid", verifyToken(), getAllOutOrders);

// get all liveCart data by zoneId and tableId or outOrderId
router.put(
  "/:businessUuid/:cartItemUuid",
  verifyToken(),
  updatecartItemStatusValidations,
  updateCartItemStatus
);

module.exports = router;
