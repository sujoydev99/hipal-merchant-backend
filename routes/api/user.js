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
  uploadUserProfilePicture,
  deleteUserProfilePicture,
  updateUserPassword,
} = require("../../common/middlewares/handlers/user");
const {
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
  updateUserPasswordValidation,
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
// upload profile picture
router.post(
  "/:userUuid/profilePicture",
  verifyToken([], [ROLES.ADMIN, ROLES.USER]),
  upload.single("file"),
  uploadUserProfilePicture
);
// delete profile picture
router.delete(
  "/:userUuid/profilePicture",
  verifyToken([], [ROLES.ADMIN, ROLES.USER]),
  deleteUserProfilePicture
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
// password update
router.put(
  "/:userUuid/password",
  verifyToken([], [ROLES.ADMIN, ROLES.USER]),
  updateUserPasswordValidation,
  updateUserPassword
);
module.exports = router;
