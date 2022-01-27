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
exports.updateZoneByUuid = (transaction, uuid, zoneObj) => {
  return new Promise(async (resolve, reject) => {
    const { zones } = await dbConn();
    try {
      await zones.update(zoneObj, {
        where: { uuid },
        transaction,
      });
      resolve();
    } catch (error) {
      reject(error);
    }
  });
};

exports.getZoneByUuid = (uuid, transaction) => {
  return new Promise(async (resolve, reject) => {
    const { zones } = await dbConn();
    try {
      const zone = await zones.findOne({
        where: { uuid },
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

exports.deleteZoneByUuid = (transaction, uuid) => {
  return new Promise(async (resolve, reject) => {
    const { zones } = await dbConn();
    try {
      const zone = await zones.destroy({
        where: { uuid },
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
