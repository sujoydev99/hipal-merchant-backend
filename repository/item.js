const { DEFAULT_EXCLUDE } = require("../common/constants/attributes");
const dbConn = require("../models");

exports.createItem = (transaction, itemObj) => {
  return new Promise(async (resolve, reject) => {
    const { items } = await dbConn();
    try {
      const item = await items.create(itemObj, { transaction });
      resolve(item);
    } catch (error) {
      reject(error);
    }
  });
};
exports.updateItemByUuidBusinessId = (
  transaction,
  uuid,
  businessId,
  itemObj
) => {
  return new Promise(async (resolve, reject) => {
    const { items } = await dbConn();
    try {
      await items.update(itemObj, {
        where: { uuid, businessId },
        transaction,
      });
      resolve();
    } catch (error) {
      reject(error);
    }
  });
};

exports.getItemByUuidBusinessId = (uuid, businessId, transaction) => {
  return new Promise(async (resolve, reject) => {
    const { items, portions, categories } = await dbConn();
    try {
      const item = await items.findOne({
        where: { uuid, businessId },
        attributes: { exclude: DEFAULT_EXCLUDE },
        transaction,
        include: [
          {
            model: portions,
            as: "portions",
            attributes: { exclude: DEFAULT_EXCLUDE },
          },
          {
            model: categories,
            as: "category",
            attributes: { exclude: DEFAULT_EXCLUDE },
          },
        ],
      });
      resolve(item);
    } catch (error) {
      reject(error);
    }
  });
};

exports.getAllItemsByBusinessIdAndOrCategoryId = (
  businessId,
  categoryId,
  transaction
) => {
  return new Promise(async (resolve, reject) => {
    const { items, portions, categories } = await dbConn();
    try {
      let whereFilter = { businessId };
      if (categoryId !== undefined) whereFilter.categoryId = categoryId;
      const itemsArr = await items.findAll({
        where: whereFilter,
        attributes: { exclude: DEFAULT_EXCLUDE },
        transaction,
        include: [
          {
            model: portions,
            as: "portions",
            attributes: { exclude: DEFAULT_EXCLUDE },
          },
          {
            model: categories,
            as: "category",
            attributes: { exclude: DEFAULT_EXCLUDE },
          },
        ],
      });
      resolve(itemsArr);
    } catch (error) {
      reject(error);
    }
  });
};

exports.deleteItemByUuidBusinessId = (transaction, uuid, businessId) => {
  return new Promise(async (resolve, reject) => {
    const { items } = await dbConn();
    try {
      const item = await items.destroy({
        where: { uuid, businessId },
        transaction,
      });
      resolve(item);
    } catch (error) {
      reject(error);
    }
  });
};

exports.getItemMetaByUuid = (uuid, businessId, transaction) => {
  return new Promise(async (resolve, reject) => {
    const { items } = await dbConn();
    try {
      const item = await items.findOne({
        where: { uuid, businessId },
        transaction,
      });
      resolve(item);
    } catch (error) {
      reject(error);
    }
  });
};

exports.createPortion = (transaction, portionObj) => {
  return new Promise(async (resolve, reject) => {
    const { portions } = await dbConn();
    try {
      const portion = await portions.create(portionObj, { transaction });
      resolve(portion);
    } catch (error) {
      reject(error);
    }
  });
};

exports.updatePortionByUuidBusinessId = (
  transaction,
  uuid,
  businessId,
  portionObj
) => {
  return new Promise(async (resolve, reject) => {
    const { portions } = await dbConn();
    try {
      await portions.update(portionObj, {
        where: { uuid, businessId },
        transaction,
      });
      resolve();
    } catch (error) {
      reject(error);
    }
  });
};

exports.deletePortionByUuidBusinessId = (transaction, uuid, businessId) => {
  return new Promise(async (resolve, reject) => {
    const { portions } = await dbConn();
    try {
      const portion = await portions.destroy({
        where: { uuid, businessId },
        transaction,
      });
      resolve(portion);
    } catch (error) {
      reject(error);
    }
  });
};
