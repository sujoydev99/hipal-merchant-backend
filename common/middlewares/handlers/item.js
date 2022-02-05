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
  getItemMetaByUuid,
} = require("../../../repository/item");
const { getStationMetaByUuid } = require("../../../repository/station");

const {
  NOT_FOUND,
  CATEGORY_CREATED,
  CATEGORY_DELETED,
  CATEGORY_UPDATED,
  CATEGORY_FETCHED,
  ITEM_CREATED,
  ITEM_UPDATED,
  ITEM_FETCHED,
  ITEM_DELETED,
  PORTION_CREATED,
  PORTION_DELETED,
} = require("../../constants/messages");
const response = require("../response");

exports.createItem = async (req, res, next) => {
  const { sequelize } = await dbConn();
  let transaction = await sequelize.transaction();
  try {
    const { categoryUuid = null, stationUuid } = req.body;
    const category = await getCategoryMetaByUuid(
      categoryUuid,
      req.business.id,
      transaction
    );
    const station = await getStationMetaByUuid(
      stationUuid,
      req.business.id,
      transaction
    );
    if (!station) throw NOT_FOUND;
    const item = await createItem(transaction, {
      ...req.body,
      businessId: req.business.id,
      categoryId: category ? category.id : null,
      stationId: station.id,
    });

    transaction.commit();
    response(
      ITEM_CREATED,
      "item",
      { ...req.body, uuid: item.uuid },
      req,
      res,
      next
    );
  } catch (error) {
    transaction.rollback();
    next(error);
  }
};
exports.updateItem = async (req, res, next) => {
  const { sequelize } = await dbConn();
  let transaction = await sequelize.transaction();
  try {
    const { itemUuid } = req.params;
    const { categoryUuid = null, stationUuid } = req.body;
    const category = await getCategoryMetaByUuid(
      categoryUuid,
      req.business.id,
      transaction
    );
    const station = await getStationMetaByUuid(
      stationUuid,
      req.business.id,
      transaction
    );
    if (!station) throw NOT_FOUND;
    await updateItemByUuidBusinessId(transaction, itemUuid, req.business.id, {
      ...req.body,
      categoryId: category ? category.id : null,
      stationId: station.id,
    });
    transaction.commit();
    response(ITEM_UPDATED, "item", {}, req, res, next);
  } catch (error) {
    transaction.rollback();
    next(error);
  }
};
exports.getAllBusinessItems = async (req, res, next) => {
  try {
    const { categoryUuid = "all" } = req.query;
    let category = null;
    let items = [];
    if (
      categoryUuid &&
      categoryUuid.toLowerCase() !== "all" &&
      categoryUuid.toLowerCase() !== "root"
    )
      category = await getCategoryMetaByUuid(categoryUuid, req.business.id);
    items = await getAllItemsByBusinessIdAndOrCategoryId(
      req.business.id,
      categoryUuid.toLowerCase() !== "all"
        ? category
          ? category.id
          : null
        : undefined
    );
    response(ITEM_FETCHED, "item", items, req, res, next);
  } catch (error) {
    next(error);
  }
};
exports.getItem = async (req, res, next) => {
  try {
    let { itemUuid } = req.params;
    const item = await getItemByUuidBusinessId(itemUuid, req.business.id);
    if (!item) throw NOT_FOUND;
    response(ITEM_FETCHED, "item", item, req, res, next);
  } catch (error) {
    next(error);
  }
};
exports.deleteItem = async (req, res, next) => {
  const { sequelize } = await dbConn();
  let transaction = await sequelize.transaction();
  try {
    let { itemUuid } = req.params;
    await deleteItemByUuidBusinessId(transaction, itemUuid, req.business.id);
    transaction.commit();
    response(ITEM_DELETED, "item", {}, req, res, next);
  } catch (error) {
    transaction.rollback();
    next(error);
  }
};

exports.deletePortion = async (req, res, next) => {
  const { sequelize } = await dbConn();
  let transaction = await sequelize.transaction();
  try {
    let { portionUuid } = req.params;
    await deletePortionByUuidBusinessId(
      transaction,
      portionUuid,
      req.business.id
    );
    transaction.commit();
    response(PORTION_DELETED, "portion", {}, req, res, next);
  } catch (error) {
    transaction.rollback();
    next(error);
  }
};
exports.createPortion = async (req, res, next) => {
  const { sequelize } = await dbConn();
  let transaction = await sequelize.transaction();
  try {
    const { itemUuid } = req.params;
    const item = await getItemMetaByUuid(
      itemUuid,
      req.business.id,
      transaction
    );
    if (!item) throw NOT_FOUND;
    const portion = await createPortion(transaction, {
      ...req.body,
      businessId: req.business.id,
      itemId: item.id,
    });

    transaction.commit();
    response(
      PORTION_CREATED,
      "portion",
      { ...req.body, uuid: portion.uuid },
      req,
      res,
      next
    );
  } catch (error) {
    transaction.rollback();
    next(error);
  }
};
