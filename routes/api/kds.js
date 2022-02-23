const express = require("express");
const router = express.Router();
const { PRIVILEGES, ROLES } = require("../../common/constants/rolesAndPrivileges");
const { verifyToken } = require("../../common/middlewares/authentication");
const {
  getKdsItemsByStation,
  updateCartItemStatusByKds,
} = require("../../common/middlewares/handlers/kds");

const { updateKdsItemStatusValidations } = require("../../common/middlewares/validations/pos/pos");

// get all kds by station in ticket/cart mode ?mode:=ticket/cart
router.get("/:businessUuid/:stationUuid", verifyToken(), getKdsItemsByStation);

// update cart item status
router.put(
  "/:businessUuid/:cartItemUuid",
  verifyToken(),
  updateKdsItemStatusValidations,
  updateCartItemStatusByKds
);

module.exports = router;
