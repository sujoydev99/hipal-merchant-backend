const { DEFAULT_EXCLUDE } = require("../common/constants/attributes");
const { clean } = require("../common/functions/clean");
const dbConn = require("../models");
const roles = require("../models/roles");

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
exports.createBusiness = (transaction, businessObj) => {
  return new Promise(async (resolve, reject) => {
    const { businesses } = await dbConn();
    try {
      const business = await businesses.create(businessObj, { transaction });
      resolve(business);
    } catch (error) {
      reject(error);
    }
  });
};

exports.getAllBusinessesByUserUuid = (uuid, transaction) => {
  return new Promise(async (resolve, reject) => {
    const { businesses, users } = await dbConn();
    try {
      const business = await businesses.findAll({
        attributes: { exclude: DEFAULT_EXCLUDE },
        include: [
          {
            model: users,
            as: "users",
            required: true,
            attributes: [],
            where: { uuid },
          },
        ],
        transaction,
      });
      resolve(business);
    } catch (error) {
      reject(error);
    }
  });
};
exports.getBusinessByUuidUserId = (uuid, userUuid, transaction) => {
  return new Promise(async (resolve, reject) => {
    const { businesses, users, businessDocs } = await dbConn();
    try {
      const business = await businesses.findOne({
        attributes: { exclude: DEFAULT_EXCLUDE },
        where: { uuid },
        include: [
          {
            model: users,
            as: "users",
            required: true,
            attributes: [],
            where: clean({ id: userUuid }),
          },
          {
            model: businessDocs,
            as: "businessDocs",
            attributes: { exclude: DEFAULT_EXCLUDE },
          },
        ],

        transaction,
      });
      resolve(business);
    } catch (error) {
      reject(error);
    }
  });
};
exports.deleteBusinessById = (transaction, id) => {
  return new Promise(async (resolve, reject) => {
    const { businesses } = await dbConn();
    try {
      const business = await businesses.destroy({
        where: { id },
        transaction,
      });
      resolve(business);
    } catch (error) {
      reject(error);
    }
  });
};

exports.updateBusinessById = (transaction, id, obj) => {
  return new Promise(async (resolve, reject) => {
    const { businesses } = await dbConn();
    try {
      const business = await businesses.update(obj, {
        where: { id },
        returning: true,
        plain: true,
        transaction,
        attributes: { exclude: DEFAULT_EXCLUDE },
      });
      resolve(business);
    } catch (error) {
      reject(error);
    }
  });
};

exports.getBusinessMetaByUuidUserId = (uuid, userUuid, transaction) => {
  return new Promise(async (resolve, reject) => {
    const { businesses, users, roles } = await dbConn();
    try {
      const business = await businesses.findOne({
        where: { uuid },
        include: [
          {
            model: users,
            as: "users",
            required: true,
            where: clean({ id: userUuid }),
          },
          { model: roles, as: "roles", required: true },
        ],
        transaction,
      });
      resolve(business);
    } catch (error) {
      reject(error);
    }
  });
};
