const { validateRules } = require("../../../functions/validator");
exports.createUpdateStationdations = async (req, res, next) => {
  try {
    const validationRules = {
      name: "required|string",
      type: "required|string|in:KITCHEN,BAR",
      notes: "string",
      isActive: "required|boolean",
    };
    await validateRules(req.body, validationRules);
    next();
  } catch (error) {
    next(error);
  }
};
