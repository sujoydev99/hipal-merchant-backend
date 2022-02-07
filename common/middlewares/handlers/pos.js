const {
  getCategoryMetaByUuid,
  getCategoryAndItemsByParentCategoryIdBusinessId,
  getAllUpperCategoriesByBusinessId,
} = require("../../../repository/category");
const { getAllItemsByBusinessIdAndOrCategoryIdForPos } = require("../../../repository/item");

const { POS_DATA_FETCHED } = require("../../constants/messages");
const response = require("../response");

exports.getAllBusinessCategoriesAndItems = async (req, res, next) => {
  try {
    const { categoryUuid = "all" } = req.query;
    let category = null;
    let childCategories = [];
    let items = [];
    let data = {};
    if (
      categoryUuid &&
      categoryUuid.toLowerCase() !== "all" &&
      categoryUuid.toLowerCase() !== "root"
    )
      category = await getCategoryMetaByUuid(categoryUuid, req.business.id);
    if (category) {
      data = await getCategoryAndItemsByParentCategoryIdBusinessId(category.id, req.business.id);
    } else {
      items = await getAllItemsByBusinessIdAndOrCategoryIdForPos(
        req.business.id,
        categoryUuid.toLowerCase() !== "all" ? null : undefined
      );
      childCategories = await getAllUpperCategoriesByBusinessId(
        categoryUuid.toLowerCase() !== "all" ? null : undefined,
        req.business.id
      );
      data = { childCategories, items };
    }
    response(POS_DATA_FETCHED, "pos", data, req, res, next);
  } catch (error) {
    next(error);
  }
};
