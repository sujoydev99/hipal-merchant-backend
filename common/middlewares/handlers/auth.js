const {
  OTP_SENT,
  SIGNIN_SUCCESS,
  EMAIL_SIGNUP_SUCCESS,
  EMAIL_SIGNIN_SUCCESS,
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
const { hash, comparepw } = require("../../functions/bcrypt");
const dbConn = require("../../../models");
exports.userMobileSignup = async (req, res, next) => {
  try {
    const { mobileNumber, countryCode } = req.body;
    const otp = await sendMobileOtp(countryCode, mobileNumber);
    response(OTP_SENT, "claims", null, req, res, next);
  } catch (error) {
    next(error);
  }
};
exports.userMobileVerifyOtp = async (req, res, next) => {
  const { sequelize } = await dbConn();
  let transaction = await sequelize.transaction();
  try {
    const { mobileNumber, countryCode, otp } = req.body;
    await verifyMobileOtp(countryCode, mobileNumber, otp);
    let user = await getOrCreateUserByMobileNumber(
      transaction,
      countryCode,
      mobileNumber,
      otp
    );
    let jwt = jwtSign(user);
    transaction.commit();
    response(SIGNIN_SUCCESS, "claims", jwt, req, res, next);
  } catch (error) {
    transaction.rollback();
    next(error);
  }
};

exports.userEmailSignup = async (req, res, next) => {
  const { sequelize } = await dbConn();
  let transaction = await sequelize.transaction();
  try {
    const { email, password } = req.body;
    let hashpw = await hash(password);
    let user = await getOrCreateUserByEmail(transaction, email, hashpw);
    transaction.commit();
    response(EMAIL_SIGNUP_SUCCESS, "claims", null, req, res, next);
  } catch (error) {
    transaction.rollback();
    next(error);
  }
};
exports.userEmailSignIn = async (req, res, next) => {
  const { sequelize } = await dbConn();
  let transaction = await sequelize.transaction();
  try {
    const { email, password } = req.body;
    let user = await getOrCreateUserByEmail(transaction, email);
    await comparepw(password, user.password);
    let jwt = await jwtSign(user);
    transaction.commit();
    response(EMAIL_SIGNIN_SUCCESS, "claims", jwt, req, res, next);
  } catch (error) {
    transaction.rollback();
    next(error);
  }
};
exports.userSignup = async (req, res, next) => {
  try {
    const { type } = req.query;
    switch (type) {
      case MOBILE:
        await this.userMobileSignup(req, res, next);
        break;
      case EMAIL:
        await this.userEmailSignup(req, res, next);
        break;
      default:
        throw AUTH_TYPE_ERROR;
    }
  } catch (error) {
    next(error);
  }
};

exports.userSignIn = async (req, res, next) => {
  try {
    const { type } = req.query;
    switch (type) {
      case MOBILE:
        await this.userMobileSignup(req, res, next);
        break;
      case EMAIL:
        await this.userEmailSignIn(req, res, next);
        break;
      default:
        throw AUTH_TYPE_ERROR;
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
