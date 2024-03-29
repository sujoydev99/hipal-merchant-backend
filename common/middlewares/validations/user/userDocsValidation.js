const { validateRules } = require("../../../functions/validator");
exports.userDocsValidation = async (req, res, next) => {
  try {
    const validationRules = {
      type: "required|string|in:AADHARCARD,PASSPORT,PANCARD",
      notes: "string",
      referenceNumber: "string",
      expiration: "date",
    };
    await validateRules(req.body, validationRules);
    next();
  } catch (error) {
    next(error);
  }
};
