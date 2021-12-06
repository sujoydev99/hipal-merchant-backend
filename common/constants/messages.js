const { EMAIL, MOBILE } = require("./variables");

module.exports = {
  DEFAULT_OTP: {
    customMessage: "default otp 123456 mocked",
    statusCode: 200,
  },
  OTP_SENT: {
    customMessage: "An OTP has been sent to your mobile number",
    statusCode: 200,
  },
  OTP_VERIFIED: {
    customMessage: "Successfully verified the OTP",
    statusCode: 200,
  },
  OTP_NOT_VERIFIED: {
    customMessage: "OTP verification failed",
    statusCode: 409,
  },
  EMAIL_SIGNUP_SUCCESS: {
    customMessage:
      "Email signup successful. Please sign-in and verify your email address",
    statusCode: 201,
  },
  EMAIL_SIGNIN_SUCCESS: {
    customMessage: "Sign-In successful.",
    statusCode: 200,
  },
  EMAIL_ALREADY_EXISTS: {
    customMessage: "Email already exists. Please sign-in instead",
    statusCode: 400,
  },
  AUTH_TYPE_ERROR: {
    customMessage: `query param 'type' must be '${EMAIL}' or '${MOBILE}'`,
    statusCode: 409,
  },
  INSUFFICIENT_PRIVILEGES: {
    customMessage: `You don't have sufficient privileges to access this module`,
    statusCode: 403,
  },
  INSUFFICIENT_ROLES: {
    customMessage: `You don't have sufficient roles to access this module`,
    statusCode: 403,
  },
  SIGNIN_SUCCESS: {
    customMessage: "Successfully signed-in",
    statusCode: 200,
  },
  INVALID_PASSWORD: {
    customMessage: "Invalid Email/Password",
    statusCode: 409,
  },
  NO_ACCOUNT: {
    customMessage: "Account not found",
    statusCode: 404,
  },
  PROFILE_FETCHED: {
    customMessage: "User profile fetched",
    statusCode: 200,
  },
  ADDRESS_ADDED: {
    customMessage: "User address added",
    statusCode: 201,
  },
  ADDRESS_UPDATED: {
    customMessage: "User address updated",
    statusCode: 200,
  },
  ADDRESS_DELETED: {
    customMessage: "User address deleted",
    statusCode: 200,
  },
  FORBIDDENED: {
    customMessage: "Forbiddened access",
    statusCode: 401,
  },
  JWT_EXPIRED: {
    customMessage: "Access token expired",
    statusCode: 401,
  },
  NOT_ALLOWED: {
    customMessage: "This action is not permitted for you",
    statusCode: 400,
  },
};
