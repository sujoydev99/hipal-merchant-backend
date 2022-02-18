const { validateRules } = require("../../../functions/validator");
exports.createUpdateTaxValidations = async (req, res, next) => {
  try {
    const validationRules = {
      name: "required|string",
      taxData: "required",
      notes: "string",
    };
    await validateRules(req.body, validationRules);
    if (typeof req.body.taxData !== "object")
      throw {
        statusCode: 409,
        customMessage: "taxData must be an object",
      };
    if (Object.keys(req.body.taxData).length === 0)
      throw {
        statusCode: 409,
        customMessage: "at leaset one tax is required",
      };
    Object.keys(req.body.taxData).forEach((key) => {
      if (typeof req.body.taxData[key] !== "number")
        throw {
          statusCode: 409,
          customMessage: "tax values must be numbers",
        };
    });
    next();
  } catch (error) {
    next(error);
  }
};
