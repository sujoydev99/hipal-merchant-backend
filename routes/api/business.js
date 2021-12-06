const express = require("express");
const { ROLES } = require("../../common/constants/rolesAndPrivileges");
const { verifyToken } = require("../../common/middlewares/authentication");
const router = express.Router();
const {
  getUserByUuid,
  addAddress,
  updateAddress,
  deleteAddress,
} = require("../../common/middlewares/handlers/profile");
const {
  userAddressValidation,
} = require("../../common/middlewares/validations/user/userAddressValidation");

// get user by uuid
router.get("/:uuid", verifyToken([], [ROLES.ADMIN, ROLES.USER]), getUserByUuid);
// add address
router.post("/", verifyToken(), addAddress);
// update address by uuid
router.put(
  "/:userUuid/address/:uuid",
  verifyToken(),
  userAddressValidation,
  updateAddress
);
// delete address by uuid
router.delete("/:userUuid/address/:uuid", verifyToken(), deleteAddress);
module.exports = router;
