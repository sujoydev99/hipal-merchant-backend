const sequelize = require("sequelize");
const { DEFAULT_EXCLUDE } = require("../common/constants/attributes");
const {
  EMAIL_ALREADY_EXISTS,
  NO_ACCOUNT,
} = require("../common/constants/messages");
const dbConn = require("../models");

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
exports.updateRoleByUuidBusinessId = (transaction, uuid, roleObj) => {
  return new Promise(async (resolve, reject) => {
    const { roles } = await dbConn();
    try {
      await roles.update(roleObj, {
        where: { uuid },
        transaction,
      });
      resolve();
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
exports.updateBusinessUserRole = (transaction, roleObj) => {
  return new Promise(async (resolve, reject) => {
    const { businessUserRoles } = await dbConn();
    try {
      const role = await businessUserRoles.update(roleObj, {
        where: { businessId: roleObj.businessId, userId: roleObj.userId },
        transaction,
      });
      resolve(role);
    } catch (error) {
      reject(error);
    }
  });
};
exports.deleteBusinessUserRole = (transaction, userId, businessId) => {
  return new Promise(async (resolve, reject) => {
    const { businessUserRoles } = await dbConn();
    try {
      const role = await businessUserRoles.destroy({
        where: { businessId, userId },
        transaction,
      });
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

exports.getRoleByUuidBusinessId = (uuid, businessId, transaction) => {
  return new Promise(async (resolve, reject) => {
    const { roles } = await dbConn();
    try {
      const role = await roles.findOne({
        where: { businessId, uuid },
        attributes: { exclude: DEFAULT_EXCLUDE },
        transaction,
      });
      resolve(role);
    } catch (error) {
      reject(error);
    }
  });
};
exports.getRoleWithUsersByUuidBusinessId = (uuid, businessId, transaction) => {
  return new Promise(async (resolve, reject) => {
    const { roles, users } = await dbConn();
    try {
      const role = await roles.findOne({
        where: { businessId, uuid },
        attributes: { exclude: DEFAULT_EXCLUDE },
        include: { model: users, as: "users" },
        transaction,
      });
      resolve(role);
    } catch (error) {
      reject(error);
    }
  });
};

exports.getAllRoleWithUsersByBusinessId = (businessId, transaction) => {
  return new Promise(async (resolve, reject) => {
    const { roles, users } = await dbConn();
    try {
      const rolesArr = await roles.findAll({
        where: { businessId },
        attributes: { exclude: DEFAULT_EXCLUDE },
        include: {
          model: users,
          as: "users",
          attributes: { exclude: DEFAULT_EXCLUDE },
        },
        transaction,
      });
      resolve(rolesArr);
    } catch (error) {
      reject(error);
    }
  });
};
exports.getAllRoleByBusinessId = (businessId, transaction) => {
  return new Promise(async (resolve, reject) => {
    const { roles, users } = await dbConn();
    try {
      const rolesArr = await roles.findAll({
        where: { businessId },
        attributes: { exclude: DEFAULT_EXCLUDE },
        transaction,
        include: {
          model: users,
          as: "users",
          attributes: { exclude: DEFAULT_EXCLUDE },
        },
      });
      resolve(rolesArr);
    } catch (error) {
      reject(error);
    }
  });
};

exports.deleteRoleByIdBusinessId = (transaction, id, businessId) => {
  return new Promise(async (resolve, reject) => {
    const { roles } = await dbConn();
    try {
      const role = await roles.destroy({
        where: { businessId, id },
        transaction,
      });
      resolve(role);
    } catch (error) {
      reject(error);
    }
  });
};
exports.deleteRoleByUuidBusinessId = (transaction, uuid, businessId) => {
  return new Promise(async (resolve, reject) => {
    const { roles } = await dbConn();
    try {
      const role = await roles.destroy({
        where: { businessId, uuid },
        transaction,
      });
      resolve(role);
    } catch (error) {
      reject(error);
    }
  });
};

exports.getRoleMetaByUuidBusinessId = (uuid, businessId, transaction) => {
  return new Promise(async (resolve, reject) => {
    const { roles } = await dbConn();
    try {
      const rolesArr = await roles.findOne({
        where: { uuid, businessId },
        transaction,
      });
      resolve(rolesArr);
    } catch (error) {
      reject(error);
    }
  });
};

exports.getRoleMetaByUserIdRoleIdBusinessId = (
  userId,
  businessId,
  transaction
) => {
  return new Promise(async (resolve, reject) => {
    const { businessUserRoles } = await dbConn();
    try {
      const rolesArr = await businessUserRoles.findOne({
        where: { userId, businessId },
        transaction,
      });
      resolve(rolesArr);
    } catch (error) {
      reject(error);
    }
  });
};
