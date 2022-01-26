const { ROLE_FORBIDDEN } = require("../../../constants/messages");
const { PRIVILEGES } = require("../../../constants/rolesAndPrivileges");
const { validateRules } = require("../../../functions/validator");
exports.createStaffValidations = async (req, res, next) => {
  try {
    const validationRules = {
      email: "string",
      mobileNumber: "string",
      countryCode: "string",
      roleUuid: "required|string",
    };
    await validateRules(req.body, validationRules);
    next();
  } catch (error) {
    next(error);
  }
};

exports.updateStaffValidations = async (req, res, next) => {
  try {
    const validationRules = {
      userUuid: "required|string",
      roleUuid: "required|string",
    };
    await validateRules(req.body, validationRules);
    next();
  } catch (error) {
    next(error);
  }
};
