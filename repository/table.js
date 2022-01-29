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
exports.updateTableByUuidBusinessIdZoneId = (
  transaction,
  uuid,
  businessId,
  zoneId,
  tableObj
) => {
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

exports.getTableByUuidBusinessIdZoneId = (
  uuid,
  businessId,
  zoneId,
  transaction
) => {
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

exports.deleteTableByUuidBusinessIdZoneId = (
  transaction,
  uuid,
  businessId,
  zoneId
) => {
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

exports.getZoneMetaByUuid = (uuid, transaction) => {
  return new Promise(async (resolve, reject) => {
    const { tables } = await dbConn();
    try {
      const zonesArr = await tables.findOne({
        where: { uuid },
        transaction,
      });
      resolve(zonesArr);
    } catch (error) {
      reject(error);
    }
  });
};