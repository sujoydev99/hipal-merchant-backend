const express = require("express");
const {
  userSignup,
  otpVerify,
  userEmailSignup,
  userSignIn,
} = require("../../common/middlewares/handlers/auth");
const {
  userSignUpValidation,
  otpValidation,
  userSignInValidation,
} = require("../../common/middlewares/validations/user/userValidations");
const router = express.Router();

// ?type=mobile/email
router.post("/signup", userSignUpValidation, userSignup);
// ?type=mobile/email
router.post("/signin", userSignInValidation, userSignIn);

// ?type=mobile
router.post("/otp/verify", otpValidation, otpVerify);
// ?type=mobile
router.post("/otp/resend", userSignUpValidation, userSignup);
module.exports = router;

// sso with google/facebook
// forgot password
// reset password
