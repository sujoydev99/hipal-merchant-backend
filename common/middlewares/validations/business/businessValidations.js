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
      "SATUARDAY",
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
    next();
  } catch (error) {
    next(error);
  }
};
