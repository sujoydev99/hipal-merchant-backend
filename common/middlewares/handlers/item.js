const dbConn = require("../../../models");
const {
  getCategoryMetaByUuid,
  createCategory,
  updateCategoryByUuidBusinessId,
  getAllCategoriesByBusinessId,
  getCategoryByUuidBusinessId,
  deleteCategoryByUuidBusinessId,
} = require("../../../repository/category");
const {
  createItem,
  getItemMetaByUuid,
  updateItemByUuidBusinessId,
  getAllItemsByBusinessIdAndOrCategoryId,
  getItemByUuidBusinessId,
} = require("../../../repository/item");

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
} = require("../../constants/messages");
const response = require("../response");

exports.createItem = async (req, res, next) => {
  const { sequelize } = await dbConn();
  let transaction = await sequelize.transaction();
  try {
    const { categoryUuid = null } = req.body;
    const category = await getCategoryMetaByUuid(
      categoryUuid,
      req.business.id,
      transaction
    );
    const item = await createItem(transaction, {
      ...req.body,
      businessId: req.business.id,
      categoryId: category ? category.id : null,
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
    const { categoryUuid = null } = req.body;
    const category = await getCategoryMetaByUuid(
      categoryUuid,
      req.business.id,
      transaction
    );
    console.log(category.dataValues);
    await updateItemByUuidBusinessId(transaction, itemUuid, req.business.id, {
      ...req.body,
      categoryId: category ? category.id : null,
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
    await deleteCategoryByUuidBusinessId(
      transaction,
      itemUuid,
      req.business.id
    );
    transaction.commit();
    response(ITEM_DELETED, "item", {}, req, res, next);
  } catch (error) {
    transaction.rollback();
    next(error);
  }
};
