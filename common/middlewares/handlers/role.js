const dbConn = require("../../../models");
const { getBusinessMetaByUuidUserId } = require("../../../repository/business");
const {
  createRole,
  updateRoleByUuidBusinessId,
  getRoleByUuidBusinessId,
  getAllRoleByBusinessId,
  deleteRoleByIdBusinessId,
  getAllRoleWithUsersByBusinessId,
  deleteRoleByUuidBusinessId,
  getRoleWithUsersByUuidBusinessId,
} = require("../../../repository/role");
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
} = require("../../constants/messages");
const { PRIVILEGES } = require("../../constants/rolesAndPrivileges");
const response = require("../response");

exports.getAllAvailablePrivileges = async (req, res, next) => {
  try {
    const privileges = PRIVILEGES;
    let privilegeArr = [];
    for (const key in privileges) {
      privilegeArr.push({
        title: privileges[key].replace("_", " ").toLowerCase(),
        privilege: privileges[key],
      });
    }
    response(
      ALL_AVAILABLE_PRIVILEGES,
      "privilege",
      privilegeArr,
      req,
      res,
      next
    );
  } catch (error) {
    next(error);
  }
};
exports.createRole = async (req, res, next) => {
  const { sequelize } = await dbConn();
  let transaction = await sequelize.transaction();
  try {
    let { businessUuid } = req.params;
    let business = await getBusinessMetaByUuidUserId(
      businessUuid,
      req.user.userTypes.indexOf("ADMIN") > -1 ? null : req.user.id,
      transaction
    );
    if (!business) throw NOT_FOUND;
    let role = await createRole(transaction, {
      ...req.body,
      businessId: business.id,
    });
    transaction.commit();
    response(
      ROLE_CREATED,
      "role",
      { ...req.body, uuid: role.uuid },
      req,
      res,
      next
    );
  } catch (error) {
    transaction.rollback();
    next(error);
  }
};
exports.updateRole = async (req, res, next) => {
  const { sequelize } = await dbConn();
  let transaction = await sequelize.transaction();
  try {
    let { businessUuid, roleUuid } = req.params;
    let business = await getBusinessMetaByUuidUserId(
      businessUuid,
      req.user.userTypes.indexOf("ADMIN") > -1 ? null : req.user.id,
      transaction
    );
    if (!business) throw NOT_FOUND;
    await updateRoleByUuidBusinessId(transaction, roleUuid, {
      ...req.body,
    });
    transaction.commit();
    response(ROLE_UPDATED, "role", {}, req, res, next);
  } catch (error) {
    transaction.rollback();
    next(error);
  }
};
exports.getAllBusinessRoles = async (req, res, next) => {
  try {
    let { businessUuid } = req.params;
    let business = await getBusinessMetaByUuidUserId(
      businessUuid,
      req.user.userTypes.indexOf("ADMIN") > -1 ? null : req.user.id
    );
    if (!business) throw NOT_FOUND;
    const role = await getAllRoleByBusinessId(business.id);
    response(ROLE_FETCHED, "role", role, req, res, next);
  } catch (error) {
    next(error);
  }
};
exports.getRole = async (req, res, next) => {
  try {
    let { businessUuid, roleUuid } = req.params;
    let business = await getBusinessMetaByUuidUserId(
      businessUuid,
      req.user.userTypes.indexOf("ADMIN") > -1 ? null : req.user.id
    );
    if (!business) throw NOT_FOUND;
    const role = await getRoleByUuidBusinessId(roleUuid, business.id);
    if (!role) throw NOT_FOUND;
    response(ROLE_FETCHED, "role", role, req, res, next);
  } catch (error) {
    next(error);
  }
};
exports.deleteRole = async (req, res, next) => {
  const { sequelize } = await dbConn();
  let transaction = await sequelize.transaction();
  try {
    let { businessUuid, roleUuid } = req.params;
    let business = await getBusinessMetaByUuidUserId(
      businessUuid,
      req.user.userTypes.indexOf("ADMIN") > -1 ? null : req.user.id
    );
    if (!business) throw NOT_FOUND;

    const role = await getRoleWithUsersByUuidBusinessId(
      roleUuid,
      business.id,
      transaction
    );
    if (!role) throw NOT_FOUND;
    else if (role.name.toLowerCase() === "owner") throw ROLE_FORBIDDEN;
    else if (role.users.length > 0) throw ROLE_USER_EXIST;
    await deleteRoleByUuidBusinessId(transaction, role.uuid, business.id);
    transaction.commit();
    response(ROLE_DELETED, "role", {}, req, res, next);
  } catch (error) {
    transaction.rollback();
    next(error);
  }
};
exports.getAllStaffByRole = async (req, res, next) => {
  try {
    let { businessUuid, roleUuid } = req.params;
    let business = await getBusinessMetaByUuidUserId(
      businessUuid,
      req.user.userTypes.indexOf("ADMIN") > -1 ? null : req.user.id
    );
    if (!business) throw NOT_FOUND;
    const roles = await getAllRoleWithUsersByBusinessId(roleUuid, business.id);
    response(ROLE_DELETED, "role", roles, req, res, next);
  } catch (error) {
    next(error);
  }
};
