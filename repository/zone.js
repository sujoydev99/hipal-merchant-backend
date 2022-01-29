const { DEFAULT_EXCLUDE } = require("../common/constants/attributes");
const dbConn = require("../models");

exports.createZone = (transaction, zoneObj) => {
  return new Promise(async (resolve, reject) => {
    const { zones } = await dbConn();
    try {
      const zone = await zones.create(zoneObj, { transaction });
      resolve(zone);
    } catch (error) {
      reject(error);
    }
  });
};
exports.updateZoneByUuidBusinessId = (
  transaction,
  uuid,
  businessId,
  zoneObj
) => {
  return new Promise(async (resolve, reject) => {
    const { zones } = await dbConn();
    try {
      await zones.update(zoneObj, {
        where: { uuid, businessId },
        transaction,
      });
      resolve();
    } catch (error) {
      reject(error);
    }
  });
};

exports.getZoneByUuidBusinessId = (uuid, businessId, transaction) => {
  return new Promise(async (resolve, reject) => {
    const { zones } = await dbConn();
    try {
      const zone = await zones.findOne({
        where: { uuid, businessId },
        attributes: { exclude: DEFAULT_EXCLUDE },
        transaction,
      });
      resolve(zone);
    } catch (error) {
      reject(error);
    }
  });
};

exports.getAllZonesByBusinessId = (businessId, transaction) => {
  return new Promise(async (resolve, reject) => {
    const { zones } = await dbConn();
    try {
      const zonesArr = await zones.findAll({
        where: { businessId },
        attributes: { exclude: DEFAULT_EXCLUDE },
        transaction,
      });
      resolve(zonesArr);
    } catch (error) {
      reject(error);
    }
  });
};

exports.deleteZoneByUuidBusinessId = (transaction, uuid, businessId) => {
  return new Promise(async (resolve, reject) => {
    const { zones } = await dbConn();
    try {
      const zone = await zones.destroy({
        where: { uuid, businessId },
        transaction,
      });
      resolve(zone);
    } catch (error) {
      reject(error);
    }
  });
};

exports.getZoneMetaByUuid = (uuid, transaction) => {
  return new Promise(async (resolve, reject) => {
    const { zones } = await dbConn();
    try {
      const zonesArr = await zones.findOne({
        where: { uuid },
        transaction,
      });
      resolve(zonesArr);
    } catch (error) {
      reject(error);
    }
  });
};
