const express = require("express");
const { userSignup } = require("../../common/middlewares/handlers/auth");
const {
  userSignUpValidation,
} = require("../../common/middlewares/validations/userValidations");
const router = express.Router();

router.post("/signup", userSignUpValidation, userSignup);
module.exports = router;

// get user/:uuid
// get users?page=1$limit=10
// add email
// edit email
// delete/deactivate email
// add contact number
// edit contact number
// delete/deactivate contact number
// add address
// edit address
// delete/deactivate address
// upload docs
