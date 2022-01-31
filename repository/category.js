const { DEFAULT_EXCLUDE } = require("../common/constants/attributes");
const dbConn = require("../models");

exports.createCategory = (transaction, categoryObj) => {
  return new Promise(async (resolve, reject) => {
    const { categories } = await dbConn();
    try {
      const category = await categories.create(categoryObj, { transaction });
      resolve(category);
    } catch (error) {
      reject(error);
    }
  });
};
exports.updateCategoryByUuidBusinessId = (
  transaction,
  uuid,
  businessId,
  categoryObj
) => {
  return new Promise(async (resolve, reject) => {
    const { categories } = await dbConn();
    try {
      await categories.update(categoryObj, {
        where: { uuid, businessId },
        transaction,
      });
      resolve();
    } catch (error) {
      reject(error);
    }
  });
};

exports.getCategoryByUuidBusinessId = (uuid, businessId, transaction) => {
  return new Promise(async (resolve, reject) => {
    const { categories } = await dbConn();
    try {
      const categoriesArr = await categories.findOne({
        where: { uuid, businessId },
        attributes: { exclude: DEFAULT_EXCLUDE },
        transaction,
        include: {
          model: categories,
          as: "childCategories",
          attributes: { exclude: DEFAULT_EXCLUDE },
        },
      });
      resolve(categoriesArr);
    } catch (error) {
      reject(error);
    }
  });
};

exports.getAllCategoriesByBusinessId = (businessId, transaction) => {
  return new Promise(async (resolve, reject) => {
    const { categories } = await dbConn();
    try {
      const categoriesArr = await categories.findAll({
        where: { businessId },
        attributes: { exclude: DEFAULT_EXCLUDE },
        transaction,
        include: {
          model: categories,
          as: "childCategories",
          attributes: { exclude: DEFAULT_EXCLUDE },
        },
      });
      resolve(categoriesArr);
    } catch (error) {
      reject(error);
    }
  });
};

exports.deleteCategoryByUuidBusinessId = (transaction, uuid, businessId) => {
  return new Promise(async (resolve, reject) => {
    const { categories } = await dbConn();
    try {
      const category = await categories.destroy({
        where: { uuid, businessId },
        transaction,
      });
      resolve(category);
    } catch (error) {
      reject(error);
    }
  });
};

exports.getCategoryMetaByUuid = (uuid, businessId, transaction) => {
  return new Promise(async (resolve, reject) => {
    const { categories } = await dbConn();
    try {
      const category = await categories.findOne({
        where: { uuid, businessId },
        transaction,
      });
      resolve(category);
    } catch (error) {
      reject(error);
    }
  });
};
