const dbConn = require("../../../models");
const {
  createTable,
  updateTableByUuidBusinessIdZoneId,
  getAllTablesByBusinessIdZoneId,
  getTableByUuidBusinessIdZoneId,
  deleteTableByUuidBusinessIdZoneId,
} = require("../../../repository/table");
const { getZoneMetaByUuid } = require("../../../repository/zone");

const {
  NOT_FOUND,
  TABLE_CREATED,
  TABLE_FETCHED,
  TABLE_UPDATED,
  TABLE_DELETED,
} = require("../../constants/messages");
const response = require("../response");

exports.createTable = async (req, res, next) => {
  const { sequelize } = await dbConn();
  let transaction = await sequelize.transaction();
  try {
    const { zoneUuid } = req.params;
    const zone = await getZoneMetaByUuid(zoneUuid);
    if (!zone) throw NOT_FOUND;
    const table = await createTable(transaction, {
      ...req.body,
      businessId: req.business.id,
      zoneId: zone.id,
    });
    transaction.commit();
    response(
      TABLE_CREATED,
      "table",
      { ...req.body, uuid: table.uuid },
      req,
      res,
      next
    );
  } catch (error) {
    transaction.rollback();
    next(error);
  }
};
exports.updateTable = async (req, res, next) => {
  const { sequelize } = await dbConn();
  let transaction = await sequelize.transaction();
  try {
    const { zoneUuid, tableUuid } = req.params;
    const zone = await getZoneMetaByUuid(zoneUuid);
    if (!zone) throw NOT_FOUND;
    await updateTableByUuidBusinessIdZoneId(
      transaction,
      tableUuid,
      req.business.id,
      zone.id,
      {
        ...req.body,
      }
    );
    transaction.commit();
    response(TABLE_UPDATED, "table", {}, req, res, next);
  } catch (error) {
    transaction.rollback();
    next(error);
  }
};
exports.getAllBusinessTablesByZone = async (req, res, next) => {
  try {
    const { zoneUuid } = req.params;
    const zone = await getZoneMetaByUuid(zoneUuid);
    if (!zone) throw NOT_FOUND;
    const tables = await getAllTablesByBusinessIdZoneId(
      req.business.id,
      zone.id
    );
    response(TABLE_FETCHED, "table", tables, req, res, next);
  } catch (error) {
    next(error);
  }
};
exports.getTable = async (req, res, next) => {
  try {
    const { zoneUuid, tableUuid } = req.params;
    const zone = await getZoneMetaByUuid(zoneUuid);
    if (!zone) throw NOT_FOUND;
    const table = await getTableByUuidBusinessIdZoneId(
      tableUuid,
      req.business.id,
      zone.id
    );
    if (!table) throw NOT_FOUND;
    response(TABLE_FETCHED, "table", table, req, res, next);
  } catch (error) {
    next(error);
  }
};
exports.deleteTable = async (req, res, next) => {
  const { sequelize } = await dbConn();
  let transaction = await sequelize.transaction();
  try {
    const { zoneUuid, tableUuid } = req.params;
    const zone = await getZoneMetaByUuid(zoneUuid);
    if (!zone) throw NOT_FOUND;
    await deleteTableByUuidBusinessIdZoneId(
      transaction,
      tableUuid,
      req.business.id,
      zone.id
    );
    transaction.commit();
    response(TABLE_DELETED, "table", {}, req, res, next);
  } catch (error) {
    transaction.rollback();
    next(error);
  }
};
