const { validateRules } = require("../../../functions/validator");
exports.businessDocsValidation = async (req, res, next) => {
  try {
    const validationRules = {
      type: "required|string|in:BUSINESS_REGISTRATION,FSSAI_LICENSE,GST_REGISTRATION",
      notes: "string",
      referenceNumber: "required|string",
      expiration: "date",
    };
    await validateRules(req.body, validationRules);
    next();
  } catch (error) {
    next(error);
  }
};
