const express = require("express");
const router = express.Router();
const { PRIVILEGES, ROLES } = require("../../common/constants/rolesAndPrivileges");
const { verifyToken } = require("../../common/middlewares/authentication");
const { getKdsItemsByStation } = require("../../common/middlewares/handlers/kds");

const {
  getAllBusinessCategoriesAndItems,
  deleteCartItem,
  updateCartItemStatus,
} = require("../../common/middlewares/handlers/pos");
const { updateKdsItemStatusValidations } = require("../../common/middlewares/validations/pos/pos");

// get all kds by station in ticket/cart mode ?mode:=ticket/cart
router.get("/:businessUuid/:stationUuid", verifyToken(), getKdsItemsByStation);
// delete cart item
router.delete("/:businessUuid/:cartItemUuid", verifyToken(), deleteCartItem);

// update cart item status
router.put(
  "/:businessUuid/:cartItemUuid",
  verifyToken(),
  updateKdsItemStatusValidations,
  updateCartItemStatus
);

module.exports = router;
