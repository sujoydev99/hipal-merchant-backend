const express = require("express");
const { ROLES } = require("../../common/constants/rolesAndPrivileges");
const { verifyToken } = require("../../common/middlewares/authentication");
const {
  createBusiness,
  getAllBusinessesByUserUuid,
  getBusinessByUuid,
  deleteBusinessByUuid,
  updateBusiness,
} = require("../../common/middlewares/handlers/business");
const {
  createUpdateBusinessValidations,
  businessAddressValidations,
  businessBankValidations,
  businessContactValidations,
} = require("../../common/middlewares/validations/business/businessValidations");
const router = express.Router();
// create business
router.post(
  "/",
  verifyToken([], [ROLES.ADMIN, ROLES.USER]),
  createUpdateBusinessValidations,
  createBusiness
);
// update basic business details
router.put(
  "/:businessUuid",
  verifyToken([], [ROLES.ADMIN, ROLES.USER]),
  createUpdateBusinessValidations,
  updateBusiness
);
// get all business
router.get(
  "/user/:userUuid",
  verifyToken([], [ROLES.ADMIN, ROLES.USER]),
  getAllBusinessesByUserUuid
);
// get business by uuid and user uuid
router.get(
  "/:businessUuid",
  verifyToken([], [ROLES.ADMIN, ROLES.USER]),
  getBusinessByUuid
);

// delete business by uuid and user uuid
router.delete(
  "/:businessUuid",
  verifyToken([], [ROLES.ADMIN, ROLES.USER]),
  deleteBusinessByUuid
);

// UPDATE ADDRESS
router.put(
  "/:businessUuid/address",
  verifyToken([], [ROLES.ADMIN, ROLES.USER]),
  businessAddressValidations,
  updateBusiness
);

// UPDATE BANK DETAILS
router.put(
  "/:businessUuid/bank",
  verifyToken([], [ROLES.ADMIN, ROLES.USER]),
  businessBankValidations,
  updateBusiness
);

// update contact details
router.put(
  "/:businessUuid/contact",
  verifyToken([], [ROLES.ADMIN, ROLES.USER]),
  businessContactValidations,
  updateBusiness
);

module.exports = router;
