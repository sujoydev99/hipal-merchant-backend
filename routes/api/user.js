const express = require("express");
const { ROLES } = require("../../common/constants/rolesAndPrivileges");
const { verifyToken } = require("../../common/middlewares/authentication");
const router = express.Router();
const {
  getUserByUuid,
  addAddress,
  updateAddress,
  deleteAddress,
  updateUserBasicDetails,
} = require("../../common/middlewares/handlers/profile");
const {
  userAddressValidation,
} = require("../../common/middlewares/validations/user/userAddressValidation");
const {
  userBasicDetailsValidation,
} = require("../../common/middlewares/validations/user/userValidations");

// get user by uuid
router.get(
  "/:userUuid",
  verifyToken([], [ROLES.ADMIN, ROLES.USER]),
  getUserByUuid
);
// update user basic details
router.put(
  "/:userUuid",
  verifyToken([], [ROLES.ADMIN, ROLES.USER]),
  userBasicDetailsValidation,
  updateUserBasicDetails
);
// add address
router.post(
  "/:userUuid/address",
  verifyToken([], [ROLES.ADMIN, ROLES.USER]),
  userAddressValidation,
  addAddress
);
// update address by uuid
router.put(
  "/:userUuid/address/:uuid",
  verifyToken([], [ROLES.ADMIN, ROLES.USER]),
  userAddressValidation,
  updateAddress
);
// delete address by uuid
router.delete(
  "/:userUuid/address/:uuid",
  verifyToken([], [ROLES.ADMIN, ROLES.USER]),
  deleteAddress
);
// upload doc
router.post(
  "/:userUuid/doc/:type",
  verifyToken([], [ROLES.ADMIN, ROLES.USER]),
  userAddressValidation,
  addAddress
);
// update doc by uuid
router.put(
  "/:userUuid/doc/:uuid",
  verifyToken([], [ROLES.ADMIN, ROLES.USER]),
  userAddressValidation,
  updateAddress
);
// delete doc by uuid
router.delete(
  "/:userUuid/doc/:uuid",
  verifyToken([], [ROLES.ADMIN, ROLES.USER]),
  deleteAddress
);
module.exports = router;
