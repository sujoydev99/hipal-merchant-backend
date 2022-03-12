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

exports.getAllCartItemsByCartIdBusinessId = (cartId, businessId, transaction) => {
  return new Promise(async (resolve, reject) => {
    const { cartItems, items, portions, cartAddons, addons, carts, taxCategory } = await dbConn();
    try {
      const cart = await carts.findOne({
        where: clean({ businessId, id: cartId }),
        attributes: { exclude: DEFAULT_EXCLUDE },
        include: {
          model: cartItems,
          as: "cartItems",
          attributes: { exclude: DEFAULT_EXCLUDE },
          include: [
            {
              model: items,
              as: "item",
              attributes: { exclude: DEFAULT_EXCLUDE },
              include: {
                model: taxCategory,
                as: "taxCategory",
                attributes: { exclude: DEFAULT_EXCLUDE },
              },
            },
            { model: portions, as: "portion", attributes: { exclude: DEFAULT_EXCLUDE } },
            {
              model: cartAddons,
              as: "cartAddons",
              attributes: { exclude: DEFAULT_EXCLUDE },
              include: [
                {
                  model: addons,
                  as: "addon",
                  attributes: { exclude: DEFAULT_EXCLUDE },
                  include: {
                    model: taxCategory,
                    as: "taxCategory",
                    attributes: { exclude: DEFAULT_EXCLUDE },
                  },
                },
              ],
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
exports.getAllCartsZoneId = (zoneId, businessId, transaction) => {
  return new Promise(async (resolve, reject) => {
    const { cartItems, items, portions, cartAddons, addons, carts } = await dbConn();
    try {
      const cartArr = await carts.findAll({
        attributes: { exclude: DEFAULT_EXCLUDE },
        include: {
          model: cartItems,
          as: "cartItems",
          where: { zoneId, businessId },
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
      resolve(cartArr);
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

exports.getAllKdsCartsByStationIdBusinessId = (stationId, businessId, transaction) => {
  return new Promise(async (resolve, reject) => {
    const { cartItems, items, portions, cartAddons, addons, carts, tables } = await dbConn();
    try {
      const cartArr = await carts.findAll({
        attributes: { exclude: DEFAULT_EXCLUDE },
        include: [
          { model: tables, as: "table", attributes: { exclude: DEFAULT_EXCLUDE } },
          {
            model: cartItems,
            as: "cartItems",
            where: { businessId },
            attributes: { exclude: DEFAULT_EXCLUDE },
            include: [
              {
                model: items,
                as: "item",
                attributes: { exclude: DEFAULT_EXCLUDE },
                where: { stationId, businessId },
              },
              { model: portions, as: "portion", attributes: { exclude: DEFAULT_EXCLUDE } },
              {
                model: cartAddons,
                as: "cartAddons",
                attributes: { exclude: DEFAULT_EXCLUDE },
                include: [{ model: addons, as: "addon", attributes: { exclude: DEFAULT_EXCLUDE } }],
              },
            ],
          },
        ],

        transaction,
      });
      resolve(cartArr);
    } catch (error) {
      reject(error);
    }
  });
};
exports.getAllKdsCartItemsByStationIdBusinessId = (stationId, businessId, transaction) => {
  return new Promise(async (resolve, reject) => {
    const { cartItems, items, portions, cartAddons, addons, carts, tables, zones } = await dbConn();
    try {
      const cartArr = await cartItems.findAll({
        attributes: { exclude: DEFAULT_EXCLUDE },
        include: [
          {
            model: carts,
            as: "cart",
            attributes: { exclude: DEFAULT_EXCLUDE },
            include: [
              {
                model: tables,
                as: "table",
                attributes: { exclude: DEFAULT_EXCLUDE },
                required: false,
              },
              { model: zones, as: "zone", attributes: { exclude: DEFAULT_EXCLUDE } },
            ],
          },
          {
            model: items,
            as: "item",
            attributes: { exclude: DEFAULT_EXCLUDE },
            where: { stationId, businessId },
          },
          { model: portions, as: "portion", attributes: { exclude: DEFAULT_EXCLUDE } },
          {
            model: cartAddons,
            as: "cartAddons",
            attributes: { exclude: DEFAULT_EXCLUDE },
            include: [{ model: addons, as: "addon", attributes: { exclude: DEFAULT_EXCLUDE } }],
          },
        ],

        transaction,
      });
      resolve(cartArr);
    } catch (error) {
      reject(error);
    }
  });
};


exports.updateCartItemKotByCartIdBusinessId = (transaction, cartId, businessId, itemObj) => {
  return new Promise(async (resolve, reject) => {
    const { cartItems } = await dbConn();
    try {
      const item = await cartItems.update(itemObj, {
        where: { cartId, businessId },
        transaction,
      });
      resolve(item);
    } catch (error) {
      reject(error);
    }
  });
};