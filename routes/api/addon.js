const express = require("express");
const router = express.Router();
const { PRIVILEGES, ROLES } = require("../../common/constants/rolesAndPrivileges");
const { verifyToken } = require("../../common/middlewares/authentication");
const {
  createAddon,
  deleteAddon,
  updateAddon,
  getAddon,
  getAllBusinessAddons,
} = require("../../common/middlewares/handlers/addon");

const { createUpdateAddonValidations } = require("../../common/middlewares/validations/item/item");

// get all business addons
router.get("/:businessUuid", verifyToken(), getAllBusinessAddons);

// create business addon
router.post("/:businessUuid", verifyToken(), createUpdateAddonValidations, createAddon);
// update business addon
router.put("/:businessUuid/:addonUuid", verifyToken(), createUpdateAddonValidations, updateAddon);

// get single addon
router.get("/:businessUuid/:addonUuid", verifyToken(), getAddon);

// delete addon
router.delete("/:businessUuid/:addonUuid", verifyToken(), deleteAddon);

module.exports = router;
