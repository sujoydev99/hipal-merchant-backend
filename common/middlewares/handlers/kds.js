const dbConn = require("../../../models");
const {
  createCartItem,
  createCartAddons,
  getCartItem,
  updateCartItemByIdBusinessId,
  deleteCartAddonsByCartItemId,
  getAllCartItemsByTableIdOrCartIdandZoneId,
  deleteCartItemByIdBusinessId,
  getCartMetaByIdBusinessId,
  deleteCartByIdBusinessId,
  getAllCartsZoneId,
  getAllKdsCartsByStationIdBusinessId,
  getAllKdsCartItemsByStationIdBusinessId,
} = require("../../../repository/cartItems");

const {
  getCategoryMetaByUuid,
  getCategoryAndItemsByParentCategoryIdBusinessId,
  getAllUpperCategoriesByBusinessId,
} = require("../../../repository/category");
const {
  getAllItemsByBusinessIdAndOrCategoryIdForPos,
  getItemPortionsAddonsMetaByUuid,
} = require("../../../repository/item");
const { getStationMetaByUuid } = require("../../../repository/station");
const { getTableMetaByUuid, createCart, getCartMetaByUuid } = require("../../../repository/table");
const { getZoneMetaByUuid } = require("../../../repository/zone");

const {
  POS_DATA_FETCHED,
  NOT_FOUND,
  POS_DATA_UDATED,
  POS_DATA_DELETED,
  KDS_DATA_FETCHED,
} = require("../../constants/messages");
const response = require("../response");

exports.getKdsItemsByStation = async (req, res, next) => {
  try {
    const { stationUuid } = req.params;
    const { mode = "ticket" } = req.query;
    const station = await getStationMetaByUuid(stationUuid, req.business.id);
    if (!station) throw NOT_FOUND;
    if (["ticket", "cart"].indexOf(mode.toLowerCase()) === -1)
      throw { status: 400, customMessage: "Invalid mode" };
    let data = [];
    if (mode.toLowerCase() === "cart")
      data = await getAllKdsCartsByStationIdBusinessId(station.id, req.business.id);
    else data = await getAllKdsCartItemsByStationIdBusinessId(station.id, req.business.id);
    response(KDS_DATA_FETCHED, "kds", data, req, res, next);
  } catch (error) {
    next(error);
  }
};

exports.getAllCartsByZone = async (req, res, next) => {
  try {
    const { zoneUuid } = req.params;
    const zone = await getZoneMetaByUuid(zoneUuid, req.business.id);
    if (!zone) throw NOT_FOUND;
    let data = await getAllCartsZoneId(zone.id, req.business.id);
    response(POS_DATA_FETCHED, "pos", data, req, res, next);
  } catch (error) {
    next(error);
  }
};

exports.deleteCartItem = async (req, res, next) => {
  const { sequelize } = await dbConn();
  let transaction = await sequelize.transaction();
  try {
    const { cartItemUuid } = req.params;
    const cartItem = await getCartItem(cartItemUuid, req.business.id, transaction);
    if (!cartItem) throw NOT_FOUND;
    await deleteCartItemByIdBusinessId(transaction, cartItem.id, req.business.id);
    let cart = await getCartMetaByIdBusinessId(cartItem.cartId, req.business.id, transaction);
    if (cart.cartItems.length === 0)
      await deleteCartByIdBusinessId(cart.id, req.business.id, transaction);
    response(POS_DATA_DELETED, "pos", {}, req, res, next);
    transaction.commit();
  } catch (error) {
    transaction.rollback();
    next(error);
  }
};

exports.updateCartItemStatus = async (req, res, next) => {
  const { sequelize } = await dbConn();
  let transaction = await sequelize.transaction();
  try {
    const { cartItemUuid } = req.params;
    const { status } = req.body;
    const cartItem = await getCartItem(cartItemUuid, req.business.id, transaction);
    if (!cartItem) throw NOT_FOUND;
    await updateCartItemByIdBusinessId(transaction, cartItem.id, req.business.id, { status });
    transaction.commit();
    response(POS_DATA_UDATED, "pos", {}, req, res, next);
  } catch (error) {
    transaction.rollback();
    next(error);
  }
};
