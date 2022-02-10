const dbConn = require("../../../models");
const {
  createCartItem,
  createCartAddons,
  getCartItem,
  updateCartItemByIdBusinessId,
  deleteCartAddonsByCartItemId,
} = require("../../../repository/cartItems");

const {
  getCategoryMetaByUuid,
  getCategoryAndItemsByParentCategoryIdBusinessId,
  getAllUpperCategoriesByBusinessId,
} = require("../../../repository/category");
const {
  getAllItemsByBusinessIdAndOrCategoryIdForPos,
  getItemMetaByUuid,
  getPortionMetaByUuid,
  getAddonMetaByUuidArrays,
  getItemPortionsAddonsMetaByUuid,
} = require("../../../repository/item");
const { getTableMetaByUuid } = require("../../../repository/table");
const { getZoneMetaByUuid } = require("../../../repository/zone");

const {
  POS_DATA_FETCHED,
  NOT_FOUND,
  POS_DATA_CREATED,
  POS_DATA_UDATED,
} = require("../../constants/messages");
const { POS_SYSTEM } = require("../../constants/pos");
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

exports.createUpdateLiveCartItem = async (req, res, next) => {
  const { sequelize } = await dbConn();
  let transaction = await sequelize.transaction();
  try {
    const {
      tableUuid = "TAKE-AWAY",
      itemUuid,
      quantity,
      portionUuid,
      addonsArray, //[{uuid, quantity}]
      zoneUuid,
      userContactNumber,
      userName,
      cartItemUuid = null,
    } = req.body;
    const table =
      tableUuid === "TAKE-AWAY" || tableUuid === "DELIVERY"
        ? null
        : await getTableMetaByUuid(tableUuid, req.business.id, transaction);
    const zone = await getZoneMetaByUuid(zoneUuid, req.business.id, transaction);
    const item = await getItemPortionsAddonsMetaByUuid(
      itemUuid,
      req.business.id,
      portionUuid,
      addonsArray.map((i) => i.uuid),
      transaction
    );

    let updated = false;
    let cartItem = null;
    // find cart item by uuid and status - SELECTION
    // if not found create new cart item and addons
    // else if found set cartItem variable and update cart item and and addons
    if (cartItemUuid !== undefined && cartItemUuid !== null) {
      cartItem = await getCartItem(cartItemUuid, req.business.id, transaction);
      if (!cartItem) throw NOT_FOUND;
      await updateCartItemByIdBusinessId(transaction, cartItem.id, req.business.id, {
        portionId: item.portions[0].id,
        quantity,
      });
      await deleteCartAddonsByCartItemId(transaction, cartItem.id);
      let addonsArr = item.addons.map((i) => ({
        cartItemId: cartItem.id,
        addonId: i.id,
        quantity: addonsArray.filter((a) => a.uuid === i.uuid)[0].quantity,
      }));
      await createCartAddons(transaction, addonsArr);
      updated = true;
    } else {
      cartItem = await createCartItem(transaction, {
        businessId: req.business.id,
        tableId: table ? table.id : null,
        zoneId: zone.id,
        itemId: item.id,
        stationId: item.stationId,
        portionId: item.portions[0].id,
        quantity,
        userName,
        userContactNumber,
        status: POS_SYSTEM.SELECTION,
      });
      let addonsArr = item.addons.map((i) => ({
        cartItemId: cartItem.id,
        addonId: i.id,
        quantity: addonsArray.filter((a) => a.uuid === i.uuid)[0].quantity,
      }));

      await createCartAddons(transaction, addonsArr);
      updated = false;
    }
    transaction.commit();
    response(
      updated ? POS_DATA_UDATED : POS_DATA_CREATED,
      "pos",
      { cartItemUuid: cartItem.uuid },
      req,
      res,
      next
    );
  } catch (error) {
    transaction.rollback();
    next(error);
  }
};
