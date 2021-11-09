const { EMAIL, MOBILE } = require("./variables");

module.exports = {
  DEFAULT_OTP: {
    message: "default otp 123456 mocked",
    statusCode: 200,
  },
  OTP_SENT: {
    message: "An OTP has been sent to your mobile number",
    statusCode: 200,
  },
  OTP_VERIFIED: {
    message: "Successfully verified the OTP",
    statusCode: 200,
  },
  OTP_NOT_VERIFIED: {
    message: "OTP verification failed",
    statusCode: 409,
  },
  EMAIL_SIGNUP_SUCCESS: {
    message:
      "Email signup successful. Please verify your email address and signIn",
    statusCode: 201,
  },
  EMAIL_ALREADY_EXISTS: {
    message: "Email already exists. Please sign-in instead",
    statusCode: 400,
  },
  AUTH_TYPE_ERROR: {
    message: `query param 'type' must be '${EMAIL}' or '${MOBILE}'`,
    statusCode: 409,
  },
  INSUFFICIENT_ROLES_ERROR: {
    message: `user does not have sufficient privileges to access this module`,
    statusCode: 401,
  },
  SIGNIN_SUCCESS: {
    message: "Successfully signed-in",
    statusCode: 200,
  },
};
