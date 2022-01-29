const dbConn = require("../../../models");

const {
  createZone,
  updateZoneByUuidBusinessId,
  getAllZonesByBusinessId,
  getZoneByUuidBusinessId,
  deleteZoneByUuidBusinessId,
} = require("../../../repository/zone");
const {
  NOT_FOUND,
  ZONE_CREATED,
  ZONE_UPDATED,
  ZONE_FETCHED,
  ZONE_DELETED,
} = require("../../constants/messages");
const response = require("../response");

exports.createZone = async (req, res, next) => {
  const { sequelize } = await dbConn();
  let transaction = await sequelize.transaction();
  try {
    let zone = await createZone(transaction, {
      ...req.body,
      businessId: req.business.id,
    });
    transaction.commit();
    response(
      ZONE_CREATED,
      "zone",
      { ...req.body, uuid: zone.uuid },
      req,
      res,
      next
    );
  } catch (error) {
    transaction.rollback();
    next(error);
  }
};
exports.updateZone = async (req, res, next) => {
  const { sequelize } = await dbConn();
  let transaction = await sequelize.transaction();
  try {
    let { zoneUuid } = req.params;
    await updateZoneByUuidBusinessId(transaction, zoneUuid,req.business.id {
      ...req.body,
    });
    transaction.commit();
    response(ZONE_UPDATED, "zone", {}, req, res, next);
  } catch (error) {
    transaction.rollback();
    next(error);
  }
};
exports.getAllBusinessZones = async (req, res, next) => {
  try {
    const zone = await getAllZonesByBusinessId(req.business.id);
    response(ZONE_FETCHED, "zone", zone, req, res, next);
  } catch (error) {
    next(error);
  }
};
exports.getZone = async (req, res, next) => {
  try {
    let { zoneUuid } = req.params;
    const role = await getZoneByUuidBusinessId(zoneUuid,req.business.id);
    if (!role) throw NOT_FOUND;
    response(ZONE_FETCHED, "role", role, req, res, next);
  } catch (error) {
    next(error);
  }
};
exports.deleteZone = async (req, res, next) => {
  const { sequelize } = await dbConn();
  let transaction = await sequelize.transaction();
  try {
    let { zoneUuid } = req.params;
    await deleteZoneByUuidBusinessId(transaction, zoneUuid, req.business.id);
    transaction.commit();
    response(ZONE_DELETED, "role", {}, req, res, next);
  } catch (error) {
    transaction.rollback();
    next(error);
  }
};
