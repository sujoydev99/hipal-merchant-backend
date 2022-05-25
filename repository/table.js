const { DEFAULT_EXCLUDE } = require("../common/constants/attributes");
const dbConn = require("../models");

exports.createTable = (transaction, tableObj) => {
  return new Promise(async (resolve, reject) => {
    const { tables } = await dbConn();
    try {
      const table = await tables.create(tableObj, { transaction });
      resolve(table);
    } catch (error) {
      reject(error);
    }
  });
};
exports.updateTableByUuidBusinessIdZoneId = (transaction, uuid, businessId, zoneId, tableObj) => {
  return new Promise(async (resolve, reject) => {
    const { tables } = await dbConn();
    try {
      await tables.update(tableObj, {
        where: { uuid, businessId, zoneId },
        transaction,
      });
      resolve();
    } catch (error) {
      reject(error);
    }
  });
};

exports.getTableByUuidBusinessIdZoneId = (uuid, businessId, zoneId, transaction) => {
  return new Promise(async (resolve, reject) => {
    const { tables } = await dbConn();
    try {
      const table = await tables.findOne({
        where: { uuid, businessId, zoneId },
        attributes: { exclude: DEFAULT_EXCLUDE },
        transaction,
      });
      resolve(table);
    } catch (error) {
      reject(error);
    }
  });
};

exports.getAllTablesByBusinessIdZoneId = (businessId, zoneId, transaction) => {
  return new Promise(async (resolve, reject) => {
    const { tables } = await dbConn();
    try {
      const tablesArr = await tables.findAll({
        where: { businessId, zoneId },
        attributes: { exclude: DEFAULT_EXCLUDE },
        transaction,
      });
      resolve(tablesArr);
    } catch (error) {
      reject(error);
    }
  });
};

exports.deleteTableByUuidBusinessIdZoneId = (transaction, uuid, businessId, zoneId) => {
  return new Promise(async (resolve, reject) => {
    const { tables } = await dbConn();
    try {
      await tables.destroy({
        where: { uuid, businessId, zoneId },
        transaction,
      });
      resolve();
    } catch (error) {
      reject(error);
    }
  });
};

exports.getTableMetaByUuid = (uuid, businessId, transaction) => {
  return new Promise(async (resolve, reject) => {
    const { tables } = await dbConn();
    try {
      const table = await tables.findOne({
        where: { uuid, businessId },
        transaction,
      });
      resolve(table);
    } catch (error) {
      reject(error);
    }
  });
};
exports.getCartMetaByUuid = (uuid, businessId, transaction) => {
  return new Promise(async (resolve, reject) => {
    const { carts } = await dbConn();
    try {
      const cart = await carts.findOne({
        where: { uuid, businessId, isSettled: false },
        transaction,
      });
      resolve(cart);
    } catch (error) {
      reject(error);
    }
  });
};

exports.createCart = (transaction, orderObj) => {
  return new Promise(async (resolve, reject) => {
    const { carts } = await dbConn();
    try {
      const outOrder = await carts.create(orderObj, { transaction });
      resolve(outOrder);
    } catch (error) {
      reject(error);
    }
  });
};
exports.getCartMetaByTableIdZoneId = (tableId, zoneId, transaction) => {
  return new Promise(async (resolve, reject) => {
    const { carts } = await dbConn();
    try {
      const cart = await carts.findOne({ where: { tableId, zoneId }, transaction });
      resolve(cart);
    } catch (error) {
      reject(error);
    }
  });
};

exports.updateCartByIdBusinessId = (transaction, id, businessId, cartObj) => {
  return new Promise(async (resolve, reject) => {
    const { carts } = await dbConn();
    try {
      await carts.update(cartObj, {
        where: { id, businessId, isSettled: false },
        transaction,
      });
      resolve();
    } catch (error) {
      reject(error);
    }
  });
};
