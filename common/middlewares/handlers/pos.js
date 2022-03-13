const { nanoid } = require("nanoid");
const { password } = require("pg/lib/defaults");
const { arrayToObject } = require("qs/lib/utils");
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
  getAllCartItemsByCartIdBusinessId,
  updateCartItemKotByCartIdBusinessId,
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
const { createOrder, createOrderItems } = require("../../../repository/order");
const {
  getTableMetaByUuid,
  createCart,
  getCartMetaByUuid,
  updateCartByIdBusinessId,
} = require("../../../repository/table");
const { getZoneMetaByUuid } = require("../../../repository/zone");

const {
  POS_DATA_FETCHED,
  NOT_FOUND,
  POS_DATA_CREATED,
  POS_DATA_UDATED,
  POS_DATA_DELETED,
  SETTLEMENT_CREATED,
  SETTELMENT_CALCULATION_ERROR,
  CART_CONFIRMED,
} = require("../../constants/messages");
const { POS_SYSTEM } = require("../../constants/pos");
const { comparepw } = require("../../functions/bcrypt");
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
      cartUuid = null,
    } = req.body;

    const addonsUuidArr = [];
    addonsArray.map((i) => {
      addonsUuidArr.push(i.uuid);
    });

    let cart = cartUuid ? await getCartMetaByUuid(cartUuid, req.business.id, transaction) : null;
    let type = ["TAKE-AWAY", "DELIVERY"].includes(tableUuid) ? tableUuid : "DINE-IN";
    const table =
      tableUuid === "TAKE-AWAY" || tableUuid === "DELIVERY"
        ? null
        : await getTableMetaByUuid(tableUuid, req.business.id, transaction);
    const zone = await getZoneMetaByUuid(zoneUuid, req.business.id, transaction);
    const item = await getItemPortionsAddonsMetaByUuid(
      itemUuid,
      req.business.id,
      portionUuid,
      addonsUuidArr,
      transaction
    );

    let updated = false;
    let cartItem = null;

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
      if (!cart)
        cart = await createCart(transaction, {
          businessId: req.business.id,
          zoneId: zone.id,
          tableId: table ? table.id : null,
          type: type,
        });

      cartItem = await createCartItem(transaction, {
        businessId: req.business.id,
        tableId: table ? table.id : null,
        cartId: cart ? cart.id : null,
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
      { cartItemUuid: cartItem.uuid, cartUuid: cart ? cart.uuid : cartItem.cart.uuid },
      req,
      res,
      next
    );
  } catch (error) {
    transaction.rollback();
    next(error);
  }
};
exports.getLiveCartByZoneOrTable = async (req, res, next) => {
  try {
    const { tableUuid, zoneUuid } = req.params;
    const { cartUuid } = req.query;
    const table =
      tableUuid === "TAKE-AWAY" || tableUuid === "DELIVERY"
        ? null
        : await getTableMetaByUuid(tableUuid, req.business.id);
    const zone = await getZoneMetaByUuid(zoneUuid, req.business.id);
    if (!zone) throw NOT_FOUND;
    const cart = cartUuid ? await getCartMetaByUuid(cartUuid, req.business.id) : null;
    const liveCart = await getAllCartItemsByTableIdOrCartIdandZoneId(
      table ? table.id : undefined,
      cart ? cart.id : undefined,
      zone.id,
      req.business.id
    );
    response(POS_DATA_FETCHED, "pos", liveCart, req, res, next);
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

exports.settlementHandler = async (req, res, next) => {
  const { sequelize } = await dbConn();
  let transaction = await sequelize.transaction();
  try {
    const { cartUuid, paymentData, userContactNumber, userName, password } = req.body;
    if (password) await comparepw(password, req.user.password);
    const cart = await getCartMetaByUuid(cartUuid, req.business.id, transaction);
    if (!cart) throw NOT_FOUND;
    let cartItems = await getAllCartItemsByCartIdBusinessId(cart.id, req.business.id, transaction);
    cartItems = cartItems.cartItems;
    if (!cartItems) throw NOT_FOUND;
    const orderItems = [];
    let order = {
      businessId: req.business.id,
      currency: req.business.currency,
      paymentData,
      userContactNumber,
      userName,
    };
    let totalAmount = 0,
      discountAmount = req.body.discountAmount || 0,
      taxAmount = 0;
    for (let i = 0; i < cartItems.length; i++) {
      let ci = cartItems[i];
      let ciad = ci.cartAddons;
      let name = ci.item.name;
      let quantity = ci.quantity;
      let amount = ci.portion.price;
      let taxData = ci.item.taxCategory.taxData;
      totalAmount += amount;
      let taxes = Object.keys(taxData);
      taxes.map((val, index) => {
        taxAmount += (taxData[val] / 100) * amount * quantity;
      });
      orderItems.push({ name, amount, quantity, taxData, businessId: req.business.id });

      for (let i = 0; i < ciad.length; i++) {
        let ca = ciad[i];
        let name = ca.addon.name;
        let quantity = ca.quantity;
        let amount = ca.addon.price;
        let taxData = ca.addon.taxCategory.taxData;
        totalAmount += amount;
        let taxes = Object.keys(taxData);
        taxes.map((val, index) => {
          taxAmount += (taxData[val] / 100) * amount * quantity;
        });
        orderItems.push({ name, amount, quantity, taxData, businessId: req.business.id });
      }
    }
    order = {
      ...order,
      totalAmount,
      discountAmount,
      paidAmount: totalAmount - discountAmount,
      taxAmount,
    };
    if (paymentData.cash + paymentData.online + paymentData.card != totalAmount - discountAmount)
      throw SETTELMENT_CALCULATION_ERROR;
    const orderData = await createOrder(transaction, order);
    let temp = [];
    orderItems.map((val, index) => {
      temp.push({ ...val, orderId: orderData.id, uuid: "orderItem_" + nanoid() });
    });
    await createOrderItems(transaction, temp);
    await updateCartByIdBusinessId(transaction, cart.id, req.business.id, { isSettled: true });
    transaction.commit();
    response(SETTLEMENT_CREATED, "pos", {}, req, res, next);
  } catch (error) {
    transaction.rollback();
    next(error);
  }
};

exports.confirmCartHandler = async (req, res, next) => {
  const { sequelize } = await dbConn();
  let transaction = await sequelize.transaction();
  try {
    const { cartUuid } = req.params;
    const cart = await getCartMetaByUuid(cartUuid, req.business.id, transaction);
    if (!cart) throw NOT_FOUND;
    await updateCartItemKotByCartIdBusinessId(transaction, cart.id, req.business.id, {
      status: POS_SYSTEM.KOT,
    });
    let cartItems = await getAllCartItemsByCartIdBusinessId(cart.id, req.business.id, transaction);
    cartItems = cartItems.cartItems;
    if (!cartItems) throw NOT_FOUND;
    const orderItems = [];
    let order = {
      currency: req.business.currency,
    };
    let totalAmount = 0,
      taxAmount = 0;
    for (let i = 0; i < cartItems.length; i++) {
      let ci = cartItems[i];
      let ciad = ci.cartAddons;
      let name = ci.item.name;
      let quantity = ci.quantity;
      let amount = ci.portion.price;
      let taxData = ci.item.taxCategory.taxData;
      totalAmount += amount * quantity;
      let taxes = Object.keys(taxData);
      taxes.map((val, index) => {
        taxAmount += (taxData[val] / 100) * amount * quantity;
      });
      orderItems.push({ quantity, item: ci.item });

      for (let i = 0; i < ciad.length; i++) {
        let ca = ciad[i];
        let name = ca.addon.name;
        let quantity = ca.quantity;
        let amount = ca.addon.price;
        let taxData = ca.addon.taxCategory.taxData;
        totalAmount += amount * quantity;
        let taxes = Object.keys(taxData);
        taxes.map((val, index) => {
          taxAmount += (taxData[val] / 100) * amount * quantity;
        });
        orderItems.push({ quantity, addon: ca.addon });
      }
    }
    order = {
      ...order,
      totalAmount,
      taxAmount,
      orderItems: orderItems,
    };

    transaction.commit();

    response(CART_CONFIRMED, "pos", order, req, res, next);
  } catch (error) {
    transaction.rollback();
    next(error);
  }
};
