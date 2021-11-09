const Validator = require("validatorjs");

exports.validator = (
  body,
  rules,
  allowExtraFields = false,
  messages,
  callback
) => {
  const validation = new Validator(body, rules, messages);
  validation.passes(() => {
    let customErrorArrays = checkForExtraFields(body, rules, allowExtraFields);
    if (customErrorArrays.length != 0) {
      addCustomValidationErrors(validation.errors, customErrorArrays);
      callback(validation.errors, false);
    }
    callback(null, true);
  });
  validation.fails(() => {
    let errors = checkForExtraFields(body, rules, allowExtraFields);
    if (errors.length !== 0) {
      addCustomValidationErrors(validation.errors, errors);
    }
    callback(validation.errors, false);
  });
};

function checkForExtraFields(body, rules, allowExtraFields) {
  if (allowExtraFields) {
    return [];
  }
  let ruleBasedProperties = Object.keys(rules);
  for (let index = 0; index < ruleBasedProperties.length; index++) {
    if (ruleBasedProperties[index].includes(".*.")) {
      ruleBasedProperties[index] = ruleBasedProperties[index].split(".*.")[0];
    }
  }

  let errorsArray = [];
  Object.keys(body).forEach((property) => {
    if (!ruleBasedProperties.includes(property)) {
      errorsArray.push({ property: property, msg: "Extra Field" });
    }
  });

  return errorsArray;
}

function addCustomValidationErrors(errors, customErrorsArray) {
  customErrorsArray.forEach((customError) => {
    errors.add(customError.property, customError.msg);
  });

  return errors;
}
