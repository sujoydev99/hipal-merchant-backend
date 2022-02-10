const { validateRules } = require("../../../functions/validator");
exports.createUpdateCartItemValidations = async (req, res, next) => {
  try {
    const cartItemValidationRules = {
      tableUuid: "required|string",
      itemUuid: "required|string",
      quantity: "required|integer|min:1",
      portionUuid: "required|string",
      addonsArray: "array",
      "addonsArray.*.uuid": "required|string",
      "addonsArray.*.quantity": "required|integer|min:1",
      zoneUuid: "required|string",
      userContactNumber: "string",
      userName: "string",
      cartItemUuid: "string",
    };
    await validateRules(req.body, cartItemValidationRules);
    // const cartItemAddonsValidationRules = {};
    // await validateRules(req.body, cartItemAddonsValidationRules);
    next();
  } catch (error) {
    next(error);
  }
};

exports.createUpdatePortionValidations = async (req, res, next) => {
  try {
    const validationRules = {
      name: "required|string",
      price: "required|integer",
      notes: "string",
      isActive: "boolean",
    };
    await validateRules(req.body, validationRules);
    next();
  } catch (error) {
    next(error);
  }
};

exports.createUpdateAddonValidations = async (req, res, next) => {
  try {
    const validationRules = {
      name: "required|string",
      price: "required|integer",
      notes: "string",
      isActive: "boolean",
    };
    await validateRules(req.body, validationRules);
    next();
  } catch (error) {
    next(error);
  }
};
