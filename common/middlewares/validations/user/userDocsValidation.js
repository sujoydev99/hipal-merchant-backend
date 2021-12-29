const { AUTH_TYPE_ERROR } = require("../../../constants/messages");
const { MOBILE, EMAIL } = require("../../../constants/variables");
const { validateRules } = require("../../../functions/validator");
exports.userDocsValidation = async (req, res, next) => {
  try {
    const validationRules = {
      lineOne: "required|string",
      lineTwo: "required|string",
      zip: "required|string",
      state: "required|string",
      city: "required|string",
      country: "required|string",
    };
    await validateRules(req.body, validationRules);
    next();
  } catch (error) {
    next(error);
  }
};
