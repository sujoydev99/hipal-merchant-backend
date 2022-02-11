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
exports.updateItemByUuidBusinessId = (transaction, uuid, businessId, itemObj) => {
  return new Promise(async (resolve, reject) => {
    const { items } = await dbConn();
    try {
      await items.update(itemObj, {
        where: { uuid, businessId },
        transaction,
        returning: true,
      });
      resolve();
    } catch (error) {
      reject(error);
    }
  });
};

exports.getItemByUuidBusinessId = (uuid, businessId, transaction) => {
  return new Promise(async (resolve, reject) => {
    const { items, portions, categories, addons, stations } = await dbConn();
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
          {
            model: addons,
            as: "addons",
            attributes: { exclude: DEFAULT_EXCLUDE },
          },
          {
            model: stations,
            as: "station",
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

exports.getAllItemsByBusinessIdAndOrCategoryId = (businessId, categoryId, transaction) => {
  return new Promise(async (resolve, reject) => {
    const { items, portions, categories, addons } = await dbConn();
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
          {
            model: addons,
            as: "addons",
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
    const { items, addons } = await dbConn();
    try {
      const item = await items.findOne({
        where: { uuid, businessId },
        include: {
          model: addons,
          as: "addons",
          required: false,
        },
        transaction,
      });
      resolve(item);
    } catch (error) {
      reject(error);
    }
  });
};
exports.getItemPortionsAddonsMetaByUuid = (
  uuid,
  businessId,
  portionUuid,
  addonUuids,
  transaction
) => {
  return new Promise(async (resolve, reject) => {
    const { items, portions, addons } = await dbConn();
    try {
      const item = await items.findOne({
        where: { uuid, businessId, isActive: true },
        include: [
          { model: portions, as: "portions", required: true, where: { uuid: portionUuid } },
          {
            model: addons,
            as: "addons",
            required: false,
            where: { uuid: addonUuids, isActive: true },
          },
        ],
        transaction,
      });
      resolve(item);
    } catch (error) {
      reject(error);
    }
  });
};
exports.getPortionMetaByUuid = (uuid, businessId, transaction) => {
  return new Promise(async (resolve, reject) => {
    const { portions } = await dbConn();
    try {
      const portion = await portions.findOne({
        where: { uuid, businessId },
        transaction,
      });
      resolve(portion);
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

exports.updatePortionByUuidBusinessId = (transaction, uuid, businessId, portionObj) => {
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

exports.getAllItemsByBusinessIdAndOrCategoryIdForPos = (businessId, categoryId, transaction) => {
  return new Promise(async (resolve, reject) => {
    const { items, portions, categories, addons } = await dbConn();
    try {
      let whereFilter = { businessId };
      if (categoryId !== undefined) whereFilter.categoryId = categoryId;
      console.log(whereFilter);
      const itemsArr = await items.findAll({
        where: whereFilter,
        attributes: { exclude: DEFAULT_EXCLUDE },
        transaction,
        include: [
          {
            model: portions,
            as: "portions",
            attributes: { exclude: DEFAULT_EXCLUDE },
            required: true,
          },
          {
            model: addons,
            as: "addons",
            attributes: { exclude: DEFAULT_EXCLUDE },
            through: { attributes: [] },
          },
        ],
      });
      resolve(itemsArr);
    } catch (error) {
      reject(error);
    }
  });
};

exports.getAddonMetaByUuidArrays = (uuid, businessId, transaction) => {
  return new Promise(async (resolve, reject) => {
    const { addons } = await dbConn();
    try {
      const addon = await addons.findAll({
        where: { uuid, businessId },
        transaction,
      });
      resolve(addon);
    } catch (error) {
      reject(error);
    }
  });
};

exports.createAddon = (transaction, addonObj) => {
  return new Promise(async (resolve, reject) => {
    const { addons } = await dbConn();
    try {
      const addon = await addons.create(addonObj, { transaction });
      resolve(addon);
    } catch (error) {
      reject(error);
    }
  });
};

exports.deleteAddonByUuidBusinessId = (transaction, uuid, businessId) => {
  return new Promise(async (resolve, reject) => {
    const { addons } = await dbConn();
    try {
      const addon = await addons.destroy({
        where: { uuid, businessId },
        transaction,
      });
      resolve(addon);
    } catch (error) {
      reject(error);
    }
  });
};

exports.getAddonMetaByUuid = (uuid, businessId, transaction) => {
  return new Promise(async (resolve, reject) => {
    const { addons } = await dbConn();
    try {
      const addon = await addons.findAll({
        where: { uuid, businessId },
        transaction,
      });
      resolve(addon);
    } catch (error) {
      reject(error);
    }
  });
};

exports.updateAddonByUuidBusinessId = (transaction, uuid, businessId, itemObj) => {
  return new Promise(async (resolve, reject) => {
    const { addons } = await dbConn();
    try {
      await addons.update(itemObj, {
        where: { uuid, businessId },
        transaction,
      });
      resolve();
    } catch (error) {
      reject(error);
    }
  });
};

exports.getAddonsByBusinessId = (businessId, transaction) => {
  return new Promise(async (resolve, reject) => {
    const { addons } = await dbConn();
    try {
      const addon = await addons.findAll({
        where: { businessId },
        attributes: { exclude: DEFAULT_EXCLUDE },
        transaction,
      });
      resolve(addon);
    } catch (error) {
      reject(error);
    }
  });
};

exports.getAddonByUuidBusinessId = (uuid, businessId, transaction) => {
  return new Promise(async (resolve, reject) => {
    const { addons } = await dbConn();
    try {
      const addon = await addons.findOne({
        where: { uuid, businessId },
        attributes: { exclude: DEFAULT_EXCLUDE },
        transaction,
      });
      resolve(addon);
    } catch (error) {
      reject(error);
    }
  });
};
