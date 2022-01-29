const { validateRules } = require("../../../functions/validator");
exports.createUpdateZoneValidations = async (req, res, next) => {
  try {
    const validationRules = {
      name: "required|string",
      capacity: "required|integer|min:0",
      type: "required|string|in:DINE-IN,TAKE-AWAY,DELIVERY",
      notes: "string",
      isActive: "required|boolean",
    };
    await validateRules(req.body, validationRules);
    next();
  } catch (error) {
    next(error);
  }
};
