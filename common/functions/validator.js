const { validator } = require("./validate");

exports.validateRules = (
  body,
  validationRule,
  allowExtraFields = false,
  customErrorMessage = {}
) => {
  return new Promise((resolve, reject) => {
    validator(
      body,
      validationRule,
      allowExtraFields,
      customErrorMessage,
      (err, status) => {
        if (!status) {
          err = {
            ...err,
            customMessage: "Request body Validation Error",
            statusCode: 409,
          };
          reject(err);
        }
        resolve();
      }
    );
  });
};
