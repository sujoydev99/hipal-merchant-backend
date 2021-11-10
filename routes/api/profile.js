const express = require("express");
const router = express.Router();
const {
  getUserByUuid,
  addAddress,
  updateAddress,
  deleteAddress,
} = require("../../common/middlewares/handlers/profile");

router.get("/:uuid", getUserByUuid);
router.post("/address", addAddress);
router.put("/address/:uuid", updateAddress);
router.delete("/address/:uuid", deleteAddress);
module.exports = router;
