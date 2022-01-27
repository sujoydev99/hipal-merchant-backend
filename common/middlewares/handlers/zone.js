const dbConn = require("../../../models");
const {
  createRole,
  updateRoleByUuidBusinessId,
  getRoleByUuidBusinessId,
  getAllRoleByBusinessId,
  getAllRoleWithUsersByBusinessId,
  deleteRoleByUuidBusinessId,
  getRoleWithUsersByUuidBusinessId,
} = require("../../../repository/role");
const {
  createZone,
  updateZoneByUuid,
  getAllZonesByBusinessId,
  getZoneByUuid,
  deleteZoneByUuid,
} = require("../../../repository/zone");
const {
  ALL_AVAILABLE_PRIVILEGES,
  ROLE_CREATED,
  ROLE_UPDATED,
  ROLE_FETCHED,
  NOT_ALLOWED,
  ROLE_USER_EXIST,
  ROLE_DELETED,
  NOT_FOUND,
  ROLE_FORBIDDEN,
  STAFF_DELETED,
  STAFF_FETCHED,
  ZONE_CREATED,
  ZONE_UPDATED,
  ZONE_FETCHED,
  ZONE_DELETED,
} = require("../../constants/messages");
const { PRIVILEGES } = require("../../constants/rolesAndPrivileges");
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
    await updateZoneByUuid(transaction, zoneUuid, {
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
    const role = await getZoneByUuid(zoneUuid);
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
    await deleteZoneByUuid(transaction, zoneUuid);
    transaction.commit();
    response(ZONE_DELETED, "role", {}, req, res, next);
  } catch (error) {
    transaction.rollback();
    next(error);
  }
};
exports.getAllStaffByRole = async (req, res, next) => {
  try {
    let { roleUuid } = req.params;
    const roles = await getAllRoleWithUsersByBusinessId(
      roleUuid,
      req.business.id
    );
    response(STAFF_FETCHED, "role", roles, req, res, next);
  } catch (error) {
    next(error);
  }
};
