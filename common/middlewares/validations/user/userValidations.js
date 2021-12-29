const { AUTH_TYPE_ERROR } = require("../../../constants/messages");
const { MOBILE, EMAIL } = require("../../../constants/variables");
const { validateRules } = require("../../../functions/validator");
exports.userEmailSignUpValidation = async (req, res, next) => {
  try {
    req.body.password_confirmation = req.body.passwordConfirmation;
    delete req.body.passwordConfirmation;
    const validationRules = {
      name: "required|string",
      email: "required|string|email",
      password: [
        "required",
        "string",
        "confirmed",
        "regex:^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$",
      ],
      password_confirmation: "required|string",
    };
    await validateRules(req.body, validationRules);
    next();
  } catch (error) {
    next(error);
  }
};
exports.userEmailSignInValidation = async (req, res, next) => {
  try {
    const validationRules = {
      email: "required|string|email",
      password: "required|string",
    };
    await validateRules(req.body, validationRules);
    next();
  } catch (error) {
    next(error);
  }
};

exports.userMobileSignUpValidation = async (req, res, next) => {
  try {
    const validationRules = {
      mobileNumber: "required|string",
      countryCode: "required|string",
    };
    await validateRules(req.body, validationRules);
    next();
  } catch (error) {
    next(error);
  }
};
exports.userMobileOtpValidation = async (req, res, next) => {
  try {
    const validationRules = {
      mobileNumber: "required|string",
      countryCode: "required|string",
      otp: "required|string",
    };
    await validateRules(req.body, validationRules);
    next();
  } catch (error) {
    next(error);
  }
};
exports.userSignUpValidation = async (req, res, next) => {
  try {
    const { type } = req.query;
    if (![MOBILE, EMAIL].includes(type)) throw AUTH_TYPE_ERROR;
    switch (type) {
      case EMAIL:
        await this.userEmailSignUpValidation(req, res, next);
        break;
      case MOBILE:
        await this.userMobileSignUpValidation(req, res, next);
        break;
    }
  } catch (error) {
    next(error);
  }
};
exports.userSignInValidation = async (req, res, next) => {
  try {
    const { type } = req.query;
    if (![MOBILE, EMAIL].includes(type)) throw AUTH_TYPE_ERROR;
    switch (type) {
      case EMAIL:
        await this.userEmailSignInValidation(req, res, next);
        break;
      case MOBILE:
        await this.userMobileSignUpValidation(req, res, next);
        break;
    }
  } catch (error) {
    next(error);
  }
};

exports.emailOtpValidation = async (req, res, next) => {
  try {
    const validationRules = {
      email: "required|string",
      otp: "required|string",
    };
    await validateRules(req.body, validationRules);
    next();
  } catch (error) {
    next(error);
  }
};
exports.emailOtpResendValidation = async (req, res, next) => {
  try {
    const validationRules = {
      email: "required|string",
    };
    await validateRules(req.body, validationRules);
    next();
  } catch (error) {
    next(error);
  }
};

exports.otpValidation = async (req, res, next) => {
  try {
    const { type } = req.query;
    if (![MOBILE, EMAIL].includes(type)) throw AUTH_TYPE_ERROR;
    switch (type) {
      case EMAIL:
        await this.emailOtpValidation(req, res, next);
        break;
      case MOBILE:
        await this.userMobileOtpValidation(req, res, next);
        break;
      default:
        throw AUTH_TYPE_ERROR;
    }
  } catch (error) {
    next(error);
  }
};

exports.resendOtpValidation = async (req, res, next) => {
  try {
    const { type } = req.query;
    if (![MOBILE, EMAIL].includes(type)) throw AUTH_TYPE_ERROR;
    switch (type) {
      case EMAIL:
        await this.userMobileSignUpValidation(req, res, next);
        break;
      case MOBILE:
        await this.emailOtpResendValidation(req, res, next);
        break;
    }
    next();
  } catch (error) {
    next(error);
  }
};
exports.userBasicDetailsValidation = async (req, res, next) => {
  try {
    const validationRules = {
      name: "required|string",
    };
    await validateRules(req.body, validationRules);
    next();
  } catch (error) {
    next(error);
  }
};
