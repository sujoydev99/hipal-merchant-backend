const { validateRules } = require("../../../functions/validator");
exports.createUpdateTableValidations = async (req, res, next) => {
  try {
    const validationRules = {
      name: "required|string",
      capacity: "required|integer|min:0",
      notes: "string",
      isActive: "required|boolean",
      status: "required|string|in:VACANT,OCCUPIED,SERVED,ORDERED,CLEANUP",
    };
    await validateRules(req.body, validationRules);
    next();
  } catch (error) {
    next(error);
  }
};
