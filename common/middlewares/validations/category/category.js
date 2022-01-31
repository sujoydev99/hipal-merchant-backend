const { string } = require("validatorjs/src/lang/en");
const { validateRules } = require("../../../functions/validator");
exports.createUpdateCategoryValidations = async (req, res, next) => {
  try {
    const validationRules = {
      name: "required|string",
      notes: "string",
      parentCategoryUuid: "string",
      isActive: "required|boolean",
    };
    await validateRules(req.body, validationRules);
    next();
  } catch (error) {
    next(error);
  }
};
