const { DEFAULT_EXCLUDE } = require("../common/constants/attributes");
const {
  EMAIL_ALREADY_EXISTS,
  NO_ACCOUNT,
} = require("../common/constants/messages");
const dbConn = require("../models");

exports.getBusinessBySlug = (slug, transaction) => {
  return new Promise(async (resolve, reject) => {
    const { businesses } = await dbConn();
    try {
      let business = await businesses.findOne({ where: { slug }, transaction });
      resolve(business);
    } catch (error) {
      reject(error);
    }
  });
};
exports.createRole = (transaction, roleObj) => {
  return new Promise(async (resolve, reject) => {
    const { roles } = await dbConn();
    try {
      const role = await roles.create(roleObj, { transaction });
      resolve(role);
    } catch (error) {
      reject(error);
    }
  });
};
exports.createBusinessUserRole = (transaction, roleObj) => {
  return new Promise(async (resolve, reject) => {
    const { businessUserRoles } = await dbConn();
    try {
      const role = await businessUserRoles.create(roleObj, { transaction });
      resolve(role);
    } catch (error) {
      reject(error);
    }
  });
};

exports.deleteRoleByBusinessId = (transaction, businessId) => {
  return new Promise(async (resolve, reject) => {
    const { roles } = await dbConn();
    try {
      const role = await roles.destroy({
        where: { businessId },
        transaction,
      });
      resolve(role);
    } catch (error) {
      reject(error);
    }
  });
};
