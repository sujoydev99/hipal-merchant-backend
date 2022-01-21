const express = require("express");
const { ROLES } = require("../../common/constants/rolesAndPrivileges");
const { verifyToken } = require("../../common/middlewares/authentication");
const {
  createBusiness,
} = require("../../common/middlewares/handlers/business");
const {
  createUpdateBusinessValidations,
} = require("../../common/middlewares/validations/business/businessValidations");
const router = express.Router();
// create business
router.post(
  "/",
  verifyToken([], [ROLES.ADMIN, ROLES.USER]),
  createUpdateBusinessValidations,
  createBusiness
);
// // get business by uuid
// router.post("/", verifyToken(), addAddress);
// // update address by uuid
// router.put(
//   "/:businessUuid/address/:uuid",
//   verifyToken(),
//   userAddressValidation,
//   updateAddress
// );
// // delete business by uuid
// router.delete("/:userUuid/address/:uuid", verifyToken(), deleteAddress);
module.exports = router;
