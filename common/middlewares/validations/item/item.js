const { validateRules } = require("../../../functions/validator");
exports.createUpdateItemValidations = async (req, res, next) => {
  try {
    const validationRules = {
      name: "required|string",
      notes: "string",
      categoryUuid: "string",
      tags: "array",
      types: "required|array",
      "tags.*.tag": "string|min:3",
      "types.*.tag":
        "required|string|min:3|in:VEG,NON-VEG,VEGAN,EGG,HALAL,KOSHER",
      isActive: "required|boolean",
      categoryUuid: "string",
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
      price: "required|array",
      isActive: "boolean",
    };
    await validateRules(req.body, validationRules);
    next();
  } catch (error) {
    next(error);
  }
};
