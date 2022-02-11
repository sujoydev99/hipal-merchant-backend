const dbConn = require("../../../models");
const { getCategoryMetaByUuid } = require("../../../repository/category");
const {
  createItem,
  updateItemByUuidBusinessId,
  getAllItemsByBusinessIdAndOrCategoryId,
  getItemByUuidBusinessId,
  deleteItemByUuidBusinessId,
  deletePortionByUuidBusinessId,
  createPortion,
  createAddon,
  deleteAddonByUuidBusinessId,
  getItemMetaByUuid,
  getAddonMetaByUuidArrays,
  getAddonMetaByUuid,
  updateAddonByUuidBusinessId,
  getAddonsByBusinessId,
  getAddonByUuidBusinessId,
} = require("../../../repository/item");
const { getStationMetaByUuid } = require("../../../repository/station");

const {
  NOT_FOUND,
  ITEM_CREATED,
  ITEM_UPDATED,
  ITEM_FETCHED,
  ITEM_DELETED,
  PORTION_CREATED,
  PORTION_DELETED,
  ADDON_CREATED,
  ADDON_DELETED,
  ADDON_UPDATED,
  ADDON_FETCHED,
} = require("../../constants/messages");
const response = require("../response");

exports.createAddon = async (req, res, next) => {
  const { sequelize } = await dbConn();
  let transaction = await sequelize.transaction();
  try {
    const addon = await createAddon(transaction, {
      ...req.body,
      businessId: req.business.id,
    });

    transaction.commit();
    response(ADDON_CREATED, "item", { ...req.body, uuid: addon.uuid }, req, res, next);
  } catch (error) {
    transaction.rollback();
    next(error);
  }
};
exports.updateAddon = async (req, res, next) => {
  const { sequelize } = await dbConn();
  let transaction = await sequelize.transaction();
  try {
    const { addonUuid } = req.params;
    const addon = await getAddonMetaByUuid(addonUuid, req.business.id, transaction);
    if (!addon) throw NOT_FOUND;
    await updateAddonByUuidBusinessId(transaction, addonUuid, req.business.id, {
      ...req.body,
    });
    transaction.commit();
    response(ADDON_UPDATED, "item", {}, req, res, next);
  } catch (error) {
    transaction.rollback();
    next(error);
  }
};
exports.getAllBusinessAddons = async (req, res, next) => {
  try {
    const addons = await getAddonsByBusinessId(req.business.id);
    response(ADDON_FETCHED, "addon", addons, req, res, next);
  } catch (error) {
    next(error);
  }
};
exports.getAddon = async (req, res, next) => {
  try {
    let { addonUuid } = req.params;
    const addon = await getAddonByUuidBusinessId(addonUuid, req.business.id);
    if (!addon) throw NOT_FOUND;
    response(ADDON_FETCHED, "addon", addon, req, res, next);
  } catch (error) {
    next(error);
  }
};

exports.deleteAddon = async (req, res, next) => {
  const { sequelize } = await dbConn();
  let transaction = await sequelize.transaction();
  try {
    let { addonUuid } = req.params;
    await deleteAddonByUuidBusinessId(transaction, addonUuid, req.business.id);
    transaction.commit();
    response(ADDON_DELETED, "addon", {}, req, res, next);
  } catch (error) {
    transaction.rollback();
    next(error);
  }
};
