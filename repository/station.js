const { DEFAULT_EXCLUDE } = require('../common/constants/attributes');
const dbConn = require('../models');

exports.createStation = (transaction, stationObj) => {
  return new Promise(async (resolve, reject) => {
    const { stations } = await dbConn();
    try {
      const station = await stations.create(stationObj, { transaction });
      resolve(station);
    } catch (error) {
      reject(error);
    }
  });
};
exports.updateStationByUuidBusinessId = (
  transaction,
  uuid,
  businessId,
  stationObj
) => {
  return new Promise(async (resolve, reject) => {
    const { stations } = await dbConn();
    try {
      await stations.update(stationObj, {
        where: { uuid, businessId },
        transaction,
      });
      resolve();
    } catch (error) {
      reject(error);
    }
  });
};

exports.getStationByUuidBusinessId = (uuid, businessId, transaction) => {
  return new Promise(async (resolve, reject) => {
    const { stations } = await dbConn();
    try {
      const station = await stations.findOne({
        where: { uuid, businessId },
        attributes: { exclude: DEFAULT_EXCLUDE },
        transaction,
      });
      resolve(station);
    } catch (error) {
      reject(error);
    }
  });
};

exports.getAllStationsByBusinessId = (businessId, transaction) => {
  return new Promise(async (resolve, reject) => {
    const { stations } = await dbConn();
    try {
      const stationsArr = await stations.findAll({
        where: { businessId },
        attributes: { exclude: DEFAULT_EXCLUDE },
        transaction,
      });
      resolve(stationsArr);
    } catch (error) {
      reject(error);
    }
  });
};

exports.deleteStationByUuidBusinessId = (transaction, uuid, businessId) => {
  return new Promise(async (resolve, reject) => {
    const { stations } = await dbConn();
    try {
      const station = await stations.destroy({
        where: { uuid, businessId },
        transaction,
      });
      resolve(station);
    } catch (error) {
      reject(error);
    }
  });
};

exports.getStationMetaByUuid = (uuid, businessId, transaction) => {
  return new Promise(async (resolve, reject) => {
    const { stations } = await dbConn();
    try {
      const station = await stations.findOne({
        where: { uuid, businessId },
        transaction,
      });
      resolve(station);
    } catch (error) {
      reject(error);
    }
  });
};
