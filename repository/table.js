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
      const zonesArr = await tables.findOne({
        where: { uuid, businessId },
        transaction,
      });
      resolve(zonesArr);
    } catch (error) {
      reject(error);
    }
  });
};
exports.getOutOrderMetaByUuid = (uuid, businessId, transaction) => {
  return new Promise(async (resolve, reject) => {
    const { outOrders } = await dbConn();
    try {
      const outorder = await outOrders.findOne({
        where: { uuid, businessId },
        transaction,
      });
      resolve(outorder);
    } catch (error) {
      reject(error);
    }
  });
};

exports.createOutOrder = (transaction, orderObj) => {
  return new Promise(async (resolve, reject) => {
    const { outOrders } = await dbConn();
    try {
      const outOrder = await outOrders.create(orderObj, { transaction });
      resolve(outOrder);
    } catch (error) {
      reject(error);
    }
  });
};
