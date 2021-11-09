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
            message: "Request body Validation Error",
            statusCode: 409,
          };
          console.log(err);
          reject(err);
        }
        resolve();
      }
    );
  });
};
