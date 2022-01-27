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
  BASIC_DETAILS_UPDATED: {
    customMessage: "User basic details updated",
    statusCode: 200,
  },
  PROFILE_PICTURE_UPDATED: {
    customMessage: "Profile picture updated",
    statusCode: 200,
  },
  PROFILE_PICTURE_DELETED: {
    customMessage: "Profile picture deleted",
    statusCode: 200,
  },
  PASSWORD_UPDATED: {
    customMessage: "User password updated",
    statusCode: 200,
  },
  PREVOIUS_PASSWORD: {
    customMessage: "Please enter your old password",
    statusCode: 409,
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
  DOC_EXISTS: {
    customMessage:
      "Please delete the existing document before uploading a new version",
    statusCode: 400,
  },
  NOT_FOUND: {
    customMessage: "The requested resource could not be found",
    statusCode: 404,
  },
  DOC_UPLOADED: {
    customMessage: "Document uploaded successfully",
    statusCode: 201,
  },
  PRIVATE_DOC_FETCHED: {
    customMessage: "Private file fetched",
    statusCode: 200,
  },
  PRIVATE_DOC_DELETED: {
    customMessage: "Private file deleted",
    statusCode: 200,
  },
  SLUG_ALREADY_EXISTS: {
    customMessage:
      "The slug is already in use by another business, please choose a different one.",
    statusCode: 400,
  },
  BUSINESS_CREATED: {
    customMessage: "Congratulations your business has been created",
    statusCode: 201,
  },
  BUSINESSES_FETCHED: {
    customMessage: "Your businesses",
    statusCode: 200,
  },
  BUSINESS_FETCHED: {
    customMessage: "Your business",
    statusCode: 200,
  },
  BUSINESS_DELETED: {
    customMessage: "Your business has been deleted",
    statusCode: 200,
  },
  BUSINESS_UPDATED: {
    customMessage: "Your business details have been updated",
    statusCode: 200,
  },
  ALL_AVAILABLE_PRIVILEGES: {
    customMessage: "Here's all the privileges you can assign.",
    statusCode: 200,
  },
  ROLE_CREATED: {
    customMessage: "Your role has been created",
    statusCode: 201,
  },
  ROLE_UPDATED: {
    customMessage: "Your role has been updated",
    statusCode: 200,
  },
  ROLE_FETCHED: {
    customMessage: "Your role",
    statusCode: 200,
  },
  ROLE_FORBIDDEN: {
    customMessage: "Owner role cannot be altered/deleted",
    statusCode: 400,
  },
  SINGLE_OWNER: {
    customMessage:
      "There can only be a single business owner, please create roles with persmissions",
    statusCode: 400,
  },
  ROLE_DELETED: {
    customMessage: "Role Deleted",
    statusCode: 200,
  },
  ROLE_USER_EXIST: {
    customMessage: "Role in use",
    statusCode: 400,
  },
  USER_NOT_FOUND: {
    customMessage: "User not found",
    statusCode: 404,
  },
  ROLE_NOT_FOUND: {
    customMessage: "Role not found",
    statusCode: 404,
  },
  STAFF_CREATED: {
    customMessage: "Your staff member has been created",
    statusCode: 201,
  },
  STAFF_EXISTS: {
    customMessage: "Staff member already exists",
    statusCode: 200,
  },
  STAFF_FETCHED: {
    customMessage: "Your staff member/s",
    statusCode: 200,
  },
  STAFF_UPDATED: {
    customMessage: "Staff member updated",
    statusCode: 200,
  },
  STAFF_DELETED: {
    customMessage: "Staff member removed from business",
    statusCode: 200,
  },
  ZONE_CREATED: {
    customMessage: "Your zone has been created",
    statusCode: 201,
  },
  ZONE_UPDATED: {
    customMessage: "Your zone has been updated",
    statusCode: 200,
  },
  ZONE_FETCHED: {
    customMessage: "Your zone",
    statusCode: 200,
  },
  ZONE_DELETED: {
    customMessage: "Zone Deleted",
    statusCode: 200,
  },
};
