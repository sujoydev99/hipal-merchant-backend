const { DEFAULT_EXCLUDE } = require("../common/constants/attributes");
const dbConn = require("../models");

exports.createTaxCategory = (transaction, taxObj) => {
  return new Promise(async (resolve, reject) => {
    const { taxCategory } = await dbConn();
    try {
      const tax = await taxCategory.create(taxObj, { transaction });
      resolve(tax);
    } catch (error) {
      reject(error);
    }
  });
};
exports.updateTaxCategoryByUuidBusinessId = (transaction, uuid, businessId, taxObj) => {
  return new Promise(async (resolve, reject) => {
    const { taxCategory } = await dbConn();
    try {
      await taxCategory.update(taxObj, {
        where: { uuid, businessId },
        transaction,
      });
      resolve();
    } catch (error) {
      reject(error);
    }
  });
};

exports.getTaxCategoryByUuidBusinessId = (uuid, businessId, transaction) => {
  return new Promise(async (resolve, reject) => {
    const { taxCategory } = await dbConn();
    try {
      const tax = await taxCategory.findOne({
        where: { uuid, businessId },
        attributes: { exclude: DEFAULT_EXCLUDE },
        transaction,
      });
      resolve(tax);
    } catch (error) {
      reject(error);
    }
  });
};

exports.getAllTaxCategoriesByBusinessId = (businessId, transaction) => {
  return new Promise(async (resolve, reject) => {
    const { taxCategory } = await dbConn();
    try {
      const taxCategoryArr = await taxCategory.findAll({
        where: { businessId },
        attributes: { exclude: DEFAULT_EXCLUDE },
        transaction,
      });
      resolve(taxCategoryArr);
    } catch (error) {
      reject(error);
    }
  });
};

exports.deleteTaxCategoryByUuidBusinessId = (transaction, uuid, businessId) => {
  return new Promise(async (resolve, reject) => {
    const { taxCategory } = await dbConn();
    try {
      const tax = await taxCategory.destroy({
        where: { uuid, businessId },
        transaction,
      });
      resolve(tax);
    } catch (error) {
      reject(error);
    }
  });
};

exports.getTaxcategoryMetaByUuid = (uuid, businessId, transaction) => {
  return new Promise(async (resolve, reject) => {
    const { taxCategory } = await dbConn();
    try {
      const tax = await taxCategory.findOne({
        where: { uuid, businessId },
        transaction,
      });
      resolve(tax);
    } catch (error) {
      reject(error);
    }
  });
};
