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
        where: { id, businessId },
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
    const { cartItems, carts } = await dbConn();
    try {
      const cartItem = await cartItems.findOne({
        where: {
          uuid,
          businessId,
          status: {
            [Op.in]: [POS_SYSTEM.KOT, POS_SYSTEM.SELECTION],
          },
        },
        include: {
          model: carts,
          as: "cart",
        },
        transaction,
      });
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
exports.deleteCartItemByIdBusinessId = (transaction, id, businessId) => {
  return new Promise(async (resolve, reject) => {
    const { cartItems } = await dbConn();
    try {
      const item = await cartItems.destroy({ where: { id, businessId }, transaction });
      resolve(item);
    } catch (error) {
      reject(error);
    }
  });
};

exports.getAllCartItemsByTableIdOrCartIdandZoneId = (
  tableId,
  cartId,
  zoneId,
  businessId,
  transaction
) => {
  return new Promise(async (resolve, reject) => {
    const { cartItems, items, portions, cartAddons, addons, carts } = await dbConn();
    try {
      const cart = await carts.findOne({
        where: clean({ businessId, tableId, zoneId, id: cartId }),
        attributes: { exclude: DEFAULT_EXCLUDE },
        include: {
          model: cartItems,
          as: "cartItems",
          attributes: { exclude: DEFAULT_EXCLUDE },
          include: [
            { model: items, as: "item", attributes: { exclude: DEFAULT_EXCLUDE } },
            { model: portions, as: "portion", attributes: { exclude: DEFAULT_EXCLUDE } },
            {
              model: cartAddons,
              as: "cartAddons",
              attributes: { exclude: DEFAULT_EXCLUDE },
              include: [{ model: addons, as: "addon", attributes: { exclude: DEFAULT_EXCLUDE } }],
            },
          ],
        },
        transaction,
      });
      resolve(cart);
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

exports.getCartMetaByIdBusinessId = (id, businessId, transaction) => {
  return new Promise(async (resolve, reject) => {
    const { carts, cartItems } = await dbConn();
    try {
      const cart = await carts.findOne({
        where: { id, businessId },
        include: {
          model: cartItems,
          as: "cartItems",
          required: false,
        },
        transaction,
      });
      resolve(cart);
    } catch (error) {
      reject(error);
    }
  });
};

exports.deleteCartByIdBusinessId = (id, businessId, transaction) => {
  return new Promise(async (resolve, reject) => {
    const { carts } = await dbConn();
    try {
      const cart = await carts.destroy({
        where: { id, businessId },
        transaction,
      });
      resolve(cart);
    } catch (error) {
      reject(error);
    }
  });
};
