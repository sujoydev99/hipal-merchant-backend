const dbConn = require("../../../models");
const {
  createTaxCategory,
  updateTaxCategoryByUuidBusinessId,
  getAllTaxCategoriesByBusinessId,
  getTaxCategoryByUuidBusinessId,
  deleteTaxCategoryByUuidBusinessId,
} = require("../../../repository/taxCategory");
const {
  NOT_FOUND,
  TAX_CREATED,
  TAX_UPDATED,
  TAX_FETCHED,
  TAX_DELETED,
} = require("../../constants/messages");
const response = require("../response");

exports.createTaxCategory = async (req, res, next) => {
  const { sequelize } = await dbConn();
  let transaction = await sequelize.transaction();
  try {
    const tax = await createTaxCategory(transaction, {
      ...req.body,
      businessId: req.business.id,
    });
    transaction.commit();
    response(TAX_CREATED, "tax", { ...req.body, uuid: tax.uuid }, req, res, next);
  } catch (error) {
    transaction.rollback();
    next(error);
  }
};
exports.updateTaxCategory = async (req, res, next) => {
  const { sequelize } = await dbConn();
  let transaction = await sequelize.transaction();
  try {
    const { taxCategoryUuid } = req.params;
    console.log(taxCategoryUuid);
    await updateTaxCategoryByUuidBusinessId(transaction, taxCategoryUuid, req.business.id, {
      ...req.body,
    });
    transaction.commit();
    response(TAX_UPDATED, "tax", {}, req, res, next);
  } catch (error) {
    transaction.rollback();
    next(error);
  }
};
exports.getAllBusinessTaxCategories = async (req, res, next) => {
  try {
    const taxes = await getAllTaxCategoriesByBusinessId(req.business.id);
    response(TAX_FETCHED, "taxes", taxes, req, res, next);
  } catch (error) {
    next(error);
  }
};
exports.getTaxCategory = async (req, res, next) => {
  try {
    const { taxCategoryUuid } = req.params;
    const tax = await getTaxCategoryByUuidBusinessId(taxCategoryUuid, req.business.id);
    if (!tax) throw NOT_FOUND;
    response(TAX_FETCHED, "tax", tax, req, res, next);
  } catch (error) {
    next(error);
  }
};
exports.deleteTaxCategory = async (req, res, next) => {
  const { sequelize } = await dbConn();
  let transaction = await sequelize.transaction();
  try {
    const { taxCategoryUuid } = req.params;
    await deleteTaxCategoryByUuidBusinessId(transaction, taxCategoryUuid, req.business.id);
    transaction.commit();
    response(TAX_DELETED, "tax", {}, req, res, next);
  } catch (error) {
    transaction.rollback();
    next(error);
  }
};
