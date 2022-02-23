const dbConn = require("../../../models");
const {
  getCartItem,
  updateCartItemByIdBusinessId,
  deleteCartItemByIdBusinessId,
  getCartMetaByIdBusinessId,
  deleteCartByIdBusinessId,
  getAllCartsZoneId,
  getAllKdsCartsByStationIdBusinessId,
  getAllKdsCartItemsByStationIdBusinessId,
} = require("../../../repository/cartItems");

const { getStationMetaByUuid } = require("../../../repository/station");
const { getZoneMetaByUuid } = require("../../../repository/zone");

const {
  POS_DATA_FETCHED,
  NOT_FOUND,
  POS_DATA_UDATED,
  POS_DATA_DELETED,
  KDS_DATA_FETCHED,
  KDS_DATA_UDATED,
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

exports.updateCartItemStatusByKds = async (req, res, next) => {
  const { sequelize } = await dbConn();
  let transaction = await sequelize.transaction();
  try {
    const { cartItemUuid } = req.params;
    const { status } = req.body;
    const cartItem = await getCartItem(cartItemUuid, req.business.id, transaction);
    if (!cartItem) throw NOT_FOUND;
    await updateCartItemByIdBusinessId(transaction, cartItem.id, req.business.id, { status });
    transaction.commit();
    response(KDS_DATA_UDATED, "pos", {}, req, res, next);
  } catch (error) {
    transaction.rollback();
    next(error);
  }
};
