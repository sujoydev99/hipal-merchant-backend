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
  NOT_FOUND,
  CATEGORY_CREATED,
  CATEGORY_DELETED,
  CATEGORY_UPDATED,
  CATEGORY_FETCHED,
} = require("../../constants/messages");
const response = require("../response");

exports.createCategory = async (req, res, next) => {
  const { sequelize } = await dbConn();
  let transaction = await sequelize.transaction();
  try {
    const { parentCategoryUuid = null } = req.body;
    const parentCategory = await getCategoryMetaByUuid(
      parentCategoryUuid,
      req.business.id,
      transaction
    );
    const category = await createCategory(transaction, {
      ...req.body,
      businessId: req.business.id,
      parentCategoryId: parentCategory ? parentCategory.id : null,
    });

    transaction.commit();
    response(
      CATEGORY_CREATED,
      "category",
      { ...req.body, uuid: category.uuid },
      req,
      res,
      next
    );
  } catch (error) {
    transaction.rollback();
    next(error);
  }
};
exports.updateCategory = async (req, res, next) => {
  const { sequelize } = await dbConn();
  let transaction = await sequelize.transaction();
  try {
    const { categoryUuid } = req.params;
    const { parentCategoryUuid = null } = req.body;
    const parentCategory = await getCategoryMetaByUuid(
      parentCategoryUuid,
      req.business.id,
      transaction
    );
    await updateCategoryByUuidBusinessId(
      transaction,
      categoryUuid,
      req.business.id,
      {
        ...req.body,
        parentCategoryId: parentCategory ? parentCategory.id : null,
      }
    );
    transaction.commit();
    response(CATEGORY_UPDATED, "category", {}, req, res, next);
  } catch (error) {
    transaction.rollback();
    next(error);
  }
};
exports.getAllBusinessCategories = async (req, res, next) => {
  try {
    const category = await getAllCategoriesByBusinessId(req.business.id);
    response(CATEGORY_FETCHED, "category", category, req, res, next);
  } catch (error) {
    next(error);
  }
};
exports.getCategory = async (req, res, next) => {
  try {
    let { categoryUuid } = req.params;
    const category = await getCategoryByUuidBusinessId(
      categoryUuid,
      req.business.id
    );
    if (!category) throw NOT_FOUND;
    response(CATEGORY_FETCHED, "category", category, req, res, next);
  } catch (error) {
    next(error);
  }
};
exports.deleteCategory = async (req, res, next) => {
  const { sequelize } = await dbConn();
  let transaction = await sequelize.transaction();
  try {
    let { categoryUuid } = req.params;
    await deleteCategoryByUuidBusinessId(
      transaction,
      categoryUuid,
      req.business.id
    );
    transaction.commit();
    response(CATEGORY_DELETED, "category", {}, req, res, next);
  } catch (error) {
    transaction.rollback();
    next(error);
  }
};
