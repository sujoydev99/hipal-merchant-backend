const { DEFAULT_EXCLUDE } = require("../common/constants/attributes");
const { clean } = require("../common/functions/clean");
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
        include: {
          model: users,
          as: "users",
          required: true,
          attributes: [],
          where: { uuid },
        },
        transaction,
      });
      resolve(business);
    } catch (error) {
      reject(error);
    }
  });
};
exports.getBusinessByUuidUserId = (uuid, userUuid, transaction) => {
  console.log("userUuid>>>>>>>>>>>>>>>>>>> ", userUuid);
  return new Promise(async (resolve, reject) => {
    const { businesses, users } = await dbConn();
    try {
      const business = await businesses.findOne({
        attributes: { exclude: DEFAULT_EXCLUDE },
        where: { uuid },
        include: {
          model: users,
          as: "users",
          required: true,
          attributes: [],
          where: clean({ id: userUuid }),
        },
        transaction,
      });
      resolve(business);
    } catch (error) {
      reject(error);
    }
  });
};
