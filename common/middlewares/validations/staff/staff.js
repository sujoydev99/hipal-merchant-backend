const { ROLE_FORBIDDEN } = require("../../../constants/messages");
const { PRIVILEGES } = require("../../../constants/rolesAndPrivileges");
const { validateRules } = require("../../../functions/validator");
exports.createStaffValidations = async (req, res, next) => {
  try {
    const validationRules = {
      email: "string",
      mobileNumber: "string",
      countryCode: "string",
      roleUuid: "required|string",
    };
    await validateRules(req.body, validationRules);
    next();
  } catch (error) {
    next(error);
  }
};
exports.businessAddressValidations = async (req, res, next) => {
  try {
    const validationRules = {
      addressLineOne: "required|string",
      addressLineTwo: "required|string",
      country: "required|string",
      state: "required|string",
      city: "required|string",
      zip: "required|string",
    };

    await validateRules(req.body, validationRules);
    next();
  } catch (error) {
    next(error);
  }
};
exports.businessBankValidations = async (req, res, next) => {
  try {
    const validationRules = {
      bankName: "required|string",
      bankIfscCode: "required|string",
      bankAccountNumber: "required|string",
    };

    await validateRules(req.body, validationRules);
    next();
  } catch (error) {
    next(error);
  }
};
exports.businessContactValidations = async (req, res, next) => {
  try {
    const validationRules = {
      "contactNumbers.*.tag": "required|string|min:8",
      "emails.*.tag": "required|string|email",
    };

    await validateRules(req.body, validationRules);
    let contactNumbers = [];
    req.body.contactNumbers.map((i) => {
      if (contactNumbers.indexOf(i.tag) === -1) contactNumbers.push(i.tag);
    });
    req.body.contactNumbers = contactNumbers;
    let emails = [];
    req.body.emails.map((i) => {
      if (emails.indexOf(i.tag) === -1) emails.push(i.tag);
    });
    req.body.emails = emails;
    next();
  } catch (error) {
    next(error);
  }
};
