const { arrayToObject } = require("qs/lib/utils");
const { AUTH_TYPE_ERROR } = require("../../../constants/messages");
const { MOBILE, EMAIL } = require("../../../constants/variables");
const { validateRules } = require("../../../functions/validator");
exports.createUpdateBusinessValidations = async (req, res, next) => {
  try {
    const validationRules = {
      name: "required|string",
      timezone: "required|string",
      "cuisine.*.tag": "required|string|min:3",
      currency: "required|string",
      notes: "string",
      slug: "required|string",
      timings: "required",
    };
    let days = [
      "MONDAY",
      "TUESDAY",
      "WEDNESDAY",
      "THURSDAY",
      "FRIDAY",
      "SATURDAY",
      "SUNDAY",
    ];
    const timingsValidationRules = {};
    for (let i = 0; i < days.length; i++) {
      timingsValidationRules[[days[i]]] = {
        to: "required|integer|between:0000,2400",
        from: "required|integer|between:0000,2400",
      };
    }
    validationRules.timings = timingsValidationRules;
    await validateRules(req.body, validationRules);
    let cuisineArray = [];
    req.body.cuisine.map((i) => {
      if (cuisineArray.indexOf(i.tag) === -1) cuisineArray.push(i.tag);
    });
    req.body.cuisine = cuisineArray;
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
