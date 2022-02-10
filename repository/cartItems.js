const { Op } = require("sequelize");
const { DEFAULT_EXCLUDE } = require("../common/constants/attributes");
const { POS_SYSTEM } = require("../common/constants/pos");
const { clean } = require("../common/functions/clean");
const dbConn = require("../models");

exports.createCartItem = (transaction, itemObj) => {
  return new Promise(async (resolve, reject) => {
    const { cartItems } = await dbConn();
    try {
      const item = await cartItems.create(itemObj, { transaction });
      resolve(item);
    } catch (error) {
      reject(error);
    }
  });
};
exports.updateCartItemByIdBusinessId = (transaction, id, businessId, itemObj) => {
  return new Promise(async (resolve, reject) => {
    const { cartItems } = await dbConn();
    try {
      const item = await cartItems.update(itemObj, {
        where: { id, businessId, status: { [Op.eq]: POS_SYSTEM.SELECTION } },
        transaction,
      });
      resolve(item);
    } catch (error) {
      reject(error);
    }
  });
};

exports.getCartItem = (uuid, businessId, transaction) => {
  return new Promise(async (resolve, reject) => {
    const { cartItems } = await dbConn();
    try {
      const cartItem = await cartItems.findOne({ where: { uuid, businessId }, transaction });
      resolve(cartItem);
    } catch (error) {
      reject(error);
    }
  });
};
exports.createCartAddons = (transaction, addonsArray) => {
  return new Promise(async (resolve, reject) => {
    const { cartAddons } = await dbConn();
    try {
      const item = await cartAddons.bulkCreate(addonsArray, { transaction });
      resolve(item);
    } catch (error) {
      reject(error);
    }
  });
};
exports.deleteCartAddonsByCartItemId = (transaction, cartItemId) => {
  return new Promise(async (resolve, reject) => {
    const { cartAddons } = await dbConn();
    try {
      const item = await cartAddons.destroy({ where: { cartItemId }, transaction });
      resolve(item);
    } catch (error) {
      reject(error);
    }
  });
};

exports.getAllCartItemsByTableIdOrOutOrderIdandZoneId = (
  tableId,
  outOrderId,
  zoneId,
  businessId,
  transaction
) => {
  return new Promise(async (resolve, reject) => {
    const { cartItems, items, portions, cartAddons, addons } = await dbConn();
    try {
      const cartItem = await cartItems.findAll({
        where: clean({ businessId, tableId, zoneId, outOrderId }),
        attribute: { exclude: { exclude: DEFAULT_EXCLUDE } },
        include: [
          { model: items, as: "item", attribute: { exclude: DEFAULT_EXCLUDE } },
          { model: portions, as: "portion", attribute: { exclude: DEFAULT_EXCLUDE } },
          {
            model: cartAddons,
            as: "cartAddons",
            attribute: { exclude: DEFAULT_EXCLUDE },
            include: [{ model: addons, as: "addon", attribute: { exclude: DEFAULT_EXCLUDE } }],
          },
        ],
        transaction,
      });
      resolve(cartItem);
    } catch (error) {
      reject(error);
    }
  });
};
exports.getAllOutOrdersZoneId = (zoneId, businessId, transaction) => {
  return new Promise(async (resolve, reject) => {
    const { cartItems, items, portions, cartAddons, addons, outOrders } = await dbConn();
    try {
      const outArr = await outOrders.findAll({
        attribute: { exclude: DEFAULT_EXCLUDE },
        include: {
          model: cartItems,
          as: "cartItems",
          where: { zoneId, businessId },
          attribute: { exclude: DEFAULT_EXCLUDE },
          include: [
            { model: items, as: "item", attribute: { exclude: DEFAULT_EXCLUDE } },
            { model: portions, as: "portion", attribute: { exclude: DEFAULT_EXCLUDE } },
            {
              model: cartAddons,
              as: "cartAddons",
              attribute: { exclude: DEFAULT_EXCLUDE },
              include: [{ model: addons, as: "addon", attribute: { exclude: DEFAULT_EXCLUDE } }],
            },
          ],
        },

        transaction,
      });
      resolve(outArr);
    } catch (error) {
      reject(error);
    }
  });
};
