const express = require("express");
const { ROLES } = require("../../common/constants/rolesAndPrivileges");
const { verifyToken } = require("../../common/middlewares/authentication");
const {
  createBusiness,
  getAllBusinessesByUserUuid,
  getBusinessByUuid,
  deleteBusinessByUuid,
  updateBusiness,
  uploadBusinessProfilePicture,
  deleteBusinessProfilePicture,
} = require("../../common/middlewares/handlers/business");
const {
  businessDocsValidation,
} = require("../../common/middlewares/validations/business/businessDocsValidation");
const {
  createUpdateBusinessValidations,
  businessAddressValidations,
  businessBankValidations,
  businessContactValidations,
} = require("../../common/middlewares/validations/business/businessValidations");
const router = express.Router();
const multer = require("multer");
const {
  uploadBusinessDoc,
  getBusinessDoc,
  deleteBusinessDoc,
} = require("../../common/middlewares/handlers/businessDocs");
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
});

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

// upload doc
router.post(
  "/:businessUuid/doc",
  verifyToken([], [ROLES.ADMIN, ROLES.USER]),
  upload.single("file"),
  businessDocsValidation,
  uploadBusinessDoc
);

// get private doc
router.get(
  "/:businessUuid/doc/:uuid",
  verifyToken([], [ROLES.ADMIN, ROLES.USER]),
  getBusinessDoc
);

// delete doc by uuid
router.delete(
  "/:businessUuid/doc/:uuid",
  verifyToken([], [ROLES.ADMIN, ROLES.USER]),
  deleteBusinessDoc
);

// upload profile picture
router.post(
  "/:businessUuid/profilePicture",
  verifyToken([], [ROLES.ADMIN, ROLES.USER]),
  upload.single("file"),
  uploadBusinessProfilePicture
);
// delete profile picture
router.delete(
  "/:businessUuid/profilePicture",
  verifyToken([], [ROLES.ADMIN, ROLES.USER]),
  deleteBusinessProfilePicture
);

// get business stats
router.get(
  "/:businessUuid/stats",
  verifyToken([], [ROLES.ADMIN, ROLES.USER]),
  deleteBusinessProfilePicture
);
// get sales data
router.get(
  "/:businessUuid/sales",
  verifyToken([], [ROLES.ADMIN, ROLES.USER]),
  deleteBusinessProfilePicture
);


module.exports = router;
