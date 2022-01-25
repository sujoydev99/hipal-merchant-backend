const { ROLE_FORBIDDEN } = require("../../../constants/messages");
const { PRIVILEGES } = require("../../../constants/rolesAndPrivileges");
const { validateRules } = require("../../../functions/validator");
exports.createUpdateRoleValidations = async (req, res, next) => {
  try {
    let temp = "";
    for (var key in PRIVILEGES) {
      temp = temp + "," + PRIVILEGES[key];
    }
    temp = temp.substring(0, temp.length - 1);
    const validationRules = {
      name: "required|string",
      "privileges.*.tag": `required|string|in:${temp}`,
    };

    await validateRules(req.body, validationRules);
    let privilegesArray = [];
    req.body.privileges.map((i) => {
      if (privilegesArray.indexOf(i.tag) === -1) privilegesArray.push(i.tag);
    });
    req.body.privileges = privilegesArray;
    if (req.body.name.toLowerCase() === "owner") throw ROLE_FORBIDDEN;
    next();
  } catch (error) {
    next(error);
  }
};
exports.businessAddressValidations = async (req, res, next) => {
  try {
    const validationRules = {
      addressLineOne: "required|string",
      addressLineTwo: "required|string",
      country: "required|string",
      state: "required|string",
      city: "required|string",
      zip: "required|string",
    };

    await validateRules(req.body, validationRules);
    next();
  } catch (error) {
    next(error);
  }
};
exports.businessBankValidations = async (req, res, next) => {
  try {
    const validationRules = {
      bankName: "required|string",
      bankIfscCode: "required|string",
      bankAccountNumber: "required|string",
    };

    await validateRules(req.body, validationRules);
    next();
  } catch (error) {
    next(error);
  }
};
exports.businessContactValidations = async (req, res, next) => {
  try {
    const validationRules = {
      "contactNumbers.*.tag": "required|string|min:8",
      "emails.*.tag": "required|string|email",
    };

    await validateRules(req.body, validationRules);
    let contactNumbers = [];
    req.body.contactNumbers.map((i) => {
      if (contactNumbers.indexOf(i.tag) === -1) contactNumbers.push(i.tag);
    });
    req.body.contactNumbers = contactNumbers;
    let emails = [];
    req.body.emails.map((i) => {
      if (emails.indexOf(i.tag) === -1) emails.push(i.tag);
    });
    req.body.emails = emails;
    next();
  } catch (error) {
    next(error);
  }
};
