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
      cartUuid: "string",
    };
    await validateRules(req.body, cartItemValidationRules);
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
exports.updatecartItemStatusValidations = async (req, res, next) => {
  try {
    const validationRules = {
      status: "required|string|in:KOT,SELECTION",
    };
    await validateRules(req.body, validationRules);
    next();
  } catch (error) {
    next(error);
  }
};
exports.updateKdsItemStatusValidations = async (req, res, next) => {
  try {
    const validationRules = {
      status: "required|string|in:KOT,SELECTION,COOKING,COOKED,SERVED",
    };
    await validateRules(req.body, validationRules);
    next();
  } catch (error) {
    next(error);
  }
};


exports.settlementValidations = async (req, res, next) => {
  try {
    const cartItemValidationRules = {
      cartUuid: "required|string",
      password:"string",discountAmount:"integer|min:0",
      "paymentData.*.online":"required|integer|min:0",
      "paymentData.*.cash":"required|integer|min:0",
      "paymentData.*.card":"required|integer|min:0",
      userContactNumber: "string",
      userName: "string",
    };
    await validateRules(req.body, cartItemValidationRules);
    next();
  } catch (error) {
    next(error);
  }
};