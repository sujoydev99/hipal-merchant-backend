const express = require("express");
const router = express.Router();
const { PRIVILEGES, ROLES } = require("../../common/constants/rolesAndPrivileges");
const { verifyToken } = require("../../common/middlewares/authentication");

const { getAllBusinessCategoriesAndItems } = require("../../common/middlewares/handlers/pos");

// get all business categories and items with meta data (subcategory and item, addons, portion)
router.get("/:businessUuid", verifyToken(), getAllBusinessCategoriesAndItems);

module.exports = router;
