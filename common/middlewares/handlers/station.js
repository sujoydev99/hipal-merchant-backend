const dbConn = require("../../../models");
const {
  createStation,
  updateStationByUuidBusinessId,
  getAllStationsByBusinessId,
  getStationByUuidBusinessId,
  deleteStationByUuidBusinessId,
} = require("../../../repository/station");
const {
  NOT_FOUND,
  STATION_CREATED,
  STATION_UPDATED,
  STATION_FETCHED,
  STATION_DELETED,
} = require("../../constants/messages");
const response = require("../response");

exports.createStation = async (req, res, next) => {
  const { sequelize } = await dbConn();
  let transaction = await sequelize.transaction();
  try {
    const station = await createStation(transaction, {
      ...req.body,
      businessId: req.business.id,
    });
    transaction.commit();
    response(
      STATION_CREATED,
      "station",
      { ...req.body, uuid: station.uuid },
      req,
      res,
      next
    );
  } catch (error) {
    transaction.rollback();
    next(error);
  }
};
exports.updateStation = async (req, res, next) => {
  const { sequelize } = await dbConn();
  let transaction = await sequelize.transaction();
  try {
    const { stationUuid } = req.params;
    await updateStationByUuidBusinessId(
      transaction,
      stationUuid,
      req.business.id,
      {
        ...req.body,
      }
    );
    transaction.commit();
    response(STATION_UPDATED, "station", {}, req, res, next);
  } catch (error) {
    transaction.rollback();
    next(error);
  }
};
exports.getAllBusinessStations = async (req, res, next) => {
  try {
    const zone = await getAllStationsByBusinessId(req.business.id);
    response(STATION_FETCHED, "station", zone, req, res, next);
  } catch (error) {
    next(error);
  }
};
exports.getStation = async (req, res, next) => {
  try {
    const { stationUuid } = req.params;
    const station = await getStationByUuidBusinessId(
      stationUuid,
      req.business.id
    );
    if (!role) throw NOT_FOUND;
    response(STATION_FETCHED, "station", station, req, res, next);
  } catch (error) {
    next(error);
  }
};
exports.deleteStation = async (req, res, next) => {
  const { sequelize } = await dbConn();
  let transaction = await sequelize.transaction();
  try {
    const { stationUuid } = req.params;
    await deleteStationByUuidBusinessId(
      transaction,
      stationUuid,
      req.business.id
    );
    transaction.commit();
    response(STATION_DELETED, "station", {}, req, res, next);
  } catch (error) {
    transaction.rollback();
    next(error);
  }
};
