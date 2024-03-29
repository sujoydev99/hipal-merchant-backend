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
  ALL_AVAILABLE_PRIVILEGES,
  ROLE_CREATED,
  ROLE_UPDATED,
  ROLE_FETCHED,
  ROLE_USER_EXIST,
  ROLE_DELETED,
  NOT_FOUND,
  ROLE_FORBIDDEN,
  STAFF_FETCHED,
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
    let role = await createRole(transaction, {
      ...req.body,
      businessId: req.business.id,
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
    let { roleUuid } = req.params;
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
    const role = await getAllRoleByBusinessId(req.business.id);
    response(ROLE_FETCHED, "role", role, req, res, next);
  } catch (error) {
    next(error);
  }
};
exports.getRole = async (req, res, next) => {
  try {
    let { roleUuid } = req.params;
    const role = await getRoleByUuidBusinessId(roleUuid, req.business.id);
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
    let { roleUuid } = req.params;
    const role = await getRoleWithUsersByUuidBusinessId(
      roleUuid,
      req.business.id,
      transaction
    );
    if (!role) throw NOT_FOUND;
    else if (role.name.toLowerCase() === "owner") throw ROLE_FORBIDDEN;
    else if (role.users.length > 0) throw ROLE_USER_EXIST;
    await deleteRoleByUuidBusinessId(transaction, role.uuid, req.business.id);
    transaction.commit();
    response(ROLE_DELETED, "role", {}, req, res, next);
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
