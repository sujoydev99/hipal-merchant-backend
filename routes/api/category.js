const express = require("express");
const router = express.Router();
const {
  PRIVILEGES,
  ROLES,
} = require("../../common/constants/rolesAndPrivileges");
const { verifyToken } = require("../../common/middlewares/authentication");
const {
  createCategory,
  updateCategory,
  getAllBusinessCategories,
  getCategory,
  deleteCategory,
} = require("../../common/middlewares/handlers/category");
const {
  createUpdateCategoryValidations,
} = require("../../common/middlewares/validations/category/category");

// get all business category
router.get("/:businessUuid", verifyToken(), getAllBusinessCategories);

// create business category
router.post(
  "/:businessUuid",
  verifyToken(),
  // verifyToken(
  //   [PRIVILEGES.ALL, PRIVILEGES.ADD_BUSINESS],
  //   [ROLES.ADMIN, ROLES.USER]
  // ),
  createUpdateCategoryValidations,
  createCategory
);
// update business category
router.put(
  "/:businessUuid/:categoryUuid",
  verifyToken(),
  // verifyToken(
  //   [PRIVILEGES.ALL, PRIVILEGES.ADD_BUSINESS],
  //   [ROLES.ADMIN, ROLES.USER]
  // ),
  createUpdateCategoryValidations,
  updateCategory
);

// get single category
router.get(
  "/:businessUuid/:categoryUuid",
  verifyToken(),
  // verifyToken(
  //   [PRIVILEGES.ALL, PRIVILEGES.ADD_BUSINESS],
  //   [ROLES.ADMIN, ROLES.USER]
  // ),
  getCategory
);

// delete category
router.delete(
  "/:businessUuid/:categoryUuid",
  verifyToken(),
  // verifyToken(
  //   [PRIVILEGES.ALL, PRIVILEGES.ADD_BUSINESS],
  //   [ROLES.ADMIN, ROLES.USER]
  // ),
  deleteCategory
);

module.exports = router;
