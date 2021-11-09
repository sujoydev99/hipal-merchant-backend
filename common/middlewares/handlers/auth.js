const {
  OTP_SENT,
  SIGNIN_SUCCESS,
  EMAIL_SIGNUP_SUCCESS,
  AUTH_TYPE_ERROR,
} = require("../../constants/messages");
const { MOBILE, EMAIL } = require("../../constants/variables");
const { sendMobileOtp, verifyMobileOtp } = require("../../functions/otp");
const { jwtSign } = require("../../functions/jwt");
const response = require("../response");
const {
  getOrCreateUserByMobileNumber,
  getOrCreateUserByEmail,
} = require("../../../repository/user");
const { hash } = require("../../functions/bcrypt");
exports.userMobileSignup = async (req, res, next) => {
  try {
    const { mobileNumber, countryCode } = req.body;
    const otp = await sendMobileOtp(countryCode, mobileNumber);
    return response(OTP_SENT, "claims", otp, req, res, next);
  } catch (error) {
    next(error);
  }
};
exports.userMobileVerifyOtp = async (req, res, next) => {
  try {
    const { mobileNumber, countryCode, otp } = req.body;
    await verifyMobileOtp(countryCode, mobileNumber, otp);
    let user = await getOrCreateUserByMobileNumber(
      countryCode,
      mobileNumber,
      otp
    );
    let jwt = jwtSign(user);
    return response(SIGNIN_SUCCESS, "claims", jwt, req, res, next);
  } catch (error) {
    next(error);
  }
};

exports.userEmailSignup = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    let hashpw = await hash(password);
    let user = await getOrCreateUserByEmail(email, hashpw);
    return response(EMAIL_SIGNUP_SUCCESS, "claims", user, req, res, next);
  } catch (error) {
    next(error);
  }
};
exports.userSignup = async (req, res, next) => {
  try {
    const { type } = req.query;
    switch (type) {
      case MOBILE:
        this.userMobileSignup(req, res, next);
        break;
      case EMAIL:
        this.userEmailSignup(req, res, next);
        break;
      default:
        res.status(201).json({ message: "type is email" });
    }
  } catch (error) {
    next(error);
  }
};
exports.otpVerify = async (req, res, next) => {
  try {
    const { type } = req.query;
    switch (type) {
      case MOBILE:
        this.userMobileVerifyOtp(req, res, next);
        break;
      case EMAIL:
      // break;
      default:
        throw AUTH_TYPE_ERROR;
    }
  } catch (error) {
    next(error);
  }
};
