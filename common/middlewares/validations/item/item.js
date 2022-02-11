const { required } = require("validatorjs/src/lang/en");
const { validateRules } = require("../../../functions/validator");
exports.createUpdateItemValidations = async (req, res, next) => {
  try {
    const validationRules = {
      name: "required|string",
      notes: "string",
      categoryUuid: "string",
      stationUuid: "required|string",
      tags: "array",
      types: "required|array",
      addons: "array",
      "tags.*.tag": "string|min:3",
      "types.*.tag": "required|string|min:3|in:VEG,NON-VEG,VEGAN,EGG,HALAL,KOSHER",
      "addons.*.tag": "required|string",
      isActive: "required|boolean",
      categoryUuid: "string",
      cgst: "required|numeric",
      sgst: "required|numeric",
    };
    await validateRules(req.body, validationRules);
    let tagsArray = [];
    req.body.tags.map((i) => {
      if (tagsArray.indexOf(i.tag) === -1) tagsArray.push(i.tag);
    });
    req.body.tags = tagsArray;
    let typesArray = [];
    req.body.types.map((i) => {
      if (typesArray.indexOf(i.tag) === -1) typesArray.push(i.tag);
    });
    req.body.types = typesArray;
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
      cgst: "required|numeric",
      sgst: "required|numeric",
    };
    await validateRules(req.body, validationRules);
    next();
  } catch (error) {
    next(error);
  }
};
