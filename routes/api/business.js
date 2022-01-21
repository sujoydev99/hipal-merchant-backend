const express = require("express");
const { ROLES } = require("../../common/constants/rolesAndPrivileges");
const { verifyToken } = require("../../common/middlewares/authentication");
const {
  createBusiness,
  getAllBusinessesByUserUuid,
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
// get all business
router.get(
  "/user/:userUuid",
  verifyToken([], [ROLES.ADMIN, ROLES.USER]),
  getAllBusinessesByUserUuid
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
