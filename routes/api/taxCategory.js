const express = require("express");
const router = express.Router();
const { PRIVILEGES, ROLES } = require("../../common/constants/rolesAndPrivileges");
const { verifyToken } = require("../../common/middlewares/authentication");
const {
  getAllBusinessTaxCategories,
  createTaxCategory,
  updateTaxCategory,
  getTaxCategory,
  deleteTaxCategory,
} = require("../../common/middlewares/handlers/taxCategories");

const { createUpdateTaxValidations } = require("../../common/middlewares/validations/tax/tax");

// get all business taxcategories
router.get("/:businessUuid", verifyToken(), getAllBusinessTaxCategories);

// create business taxcategory
router.post("/:businessUuid", verifyToken(), createUpdateTaxValidations, createTaxCategory);
// update business taxcategory
router.put(
  "/:businessUuid/:taxCategoryUuid",
  verifyToken(),
  createUpdateTaxValidations,
  updateTaxCategory
);

// get single taxcategory
router.get("/:businessUuid/:taxCategoryUuid", verifyToken(), getTaxCategory);

// delete taxcategory
router.delete("/:businessUuid/:taxCategoryUuid", verifyToken(), deleteTaxCategory);

module.exports = router;
