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
} = require("../../common/middlewares/handlers/user");
const {
  getPresignedUrl,
  uploadUserDoc,
  getUserDoc,
  deleteUserDoc,
} = require("../../common/middlewares/handlers/userDocs");
const {
  userAddressValidation,
} = require("../../common/middlewares/validations/user/userAddressValidation");
const {
  userDocsValidation,
} = require("../../common/middlewares/validations/user/userDocsValidation");
const {
  userBasicDetailsValidation,
} = require("../../common/middlewares/validations/user/userValidations");
const multer = require("multer");
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
});
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
  "/:userUuid/doc",
  verifyToken([], [ROLES.ADMIN, ROLES.USER]),
  upload.single("file"),
  userDocsValidation,
  uploadUserDoc
);
// get private doc
router.get(
  "/:userUuid/doc/:uuid",
  verifyToken([], [ROLES.ADMIN, ROLES.USER]),
  getUserDoc
);

// delete doc by uuid
router.delete(
  "/:userUuid/doc/:uuid",
  verifyToken([], [ROLES.ADMIN, ROLES.USER]),
  deleteUserDoc
);
module.exports = router;
