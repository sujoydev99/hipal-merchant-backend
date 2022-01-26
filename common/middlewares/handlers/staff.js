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
  createBusinessUserRole,
  getRoleMetaByUuidBusinessId,
  getRoleMetaByUserIdRoleIdBusinessId,
} = require("../../../repository/role");
const {
  getOrCreateUserByEmail,
  getUserByEmail,
  getUserByMobileNumber,
  getAllUsersByBusinessId,
} = require("../../../repository/user");
const {
  ALL_AVAILABLE_PRIVILEGES,
  ROLE_CREATED,
  ROLE_UPDATED,
  ROLE_FETCHED,
  NOT_ALLOWED,
  ROLE_USER_EXIST,
  ROLE_DELETED,
  NOT_FOUND,
  USER_NOT_FOUND,
  ROLE_NOT_FOUND,
  STAFF_CREATED,
  STAFF_EXISTS,
  STAFF_FETCHED,
} = require("../../constants/messages");
const { PRIVILEGES } = require("../../constants/rolesAndPrivileges");
const { EMAIL } = require("../../constants/variables");
const response = require("../response");

exports.createStaff = async (req, res, next) => {
  const { sequelize } = await dbConn();
  let transaction = await sequelize.transaction();
  try {
    let { businessUuid } = req.params;
    let { type } = req.query;
    let { email, mobileNumber, countryCode, roleUuid } = req.body;
    let business = await getBusinessMetaByUuidUserId(
      businessUuid,
      req.user.userTypes.indexOf("ADMIN") > -1 ? null : req.user.id,
      transaction
    );
    if (!business) throw NOT_FOUND;
    const user =
      type === EMAIL
        ? await getUserByEmail(email, transaction)
        : await getUserByMobileNumber(mobileNumber, countryCode, transaction);
    if (!user) throw USER_NOT_FOUND;
    const role = await getRoleMetaByUuidBusinessId(
      roleUuid,
      business.id,
      transaction
    );
    if (!role) throw ROLE_NOT_FOUND;
    const existingStaff = await getRoleMetaByUserIdRoleIdBusinessId(
      user.id,
      role.id,
      business.id,
      transaction
    );
    if (existingStaff) throw STAFF_EXISTS;
    await createBusinessUserRole(transaction, {
      userId: user.id,
      businessId: business.id,
      roleId: role.id,
    });
    transaction.commit();
    response(STAFF_CREATED, "staff", { ...req.body }, req, res, next);
  } catch (error) {
    transaction.rollback();
    next(error);
  }
};
exports.updateStaff = async (req, res, next) => {
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
exports.getAllBusinessStaff = async (req, res, next) => {
  try {
    let { businessUuid } = req.params;
    let business = await getBusinessMetaByUuidUserId(
      businessUuid,
      req.user.userTypes.indexOf("ADMIN") > -1 ? null : req.user.id
    );
    if (!business) throw NOT_FOUND;
    const staff = await getAllUsersByBusinessId(business.id);
    response(STAFF_FETCHED, "staff", staff, req, res, next);
  } catch (error) {
    next(error);
  }
};
exports.getStaff = async (req, res, next) => {
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
exports.deleteStaff = async (req, res, next) => {
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
    else if (role.users.length > 0) throw ROLE_USER_EXIST;
    await deleteRoleByUuidBusinessId(transaction, role.uuid, business.id);
    transaction.commit();
    response(ROLE_DELETED, "role", {}, req, res, next);
  } catch (error) {
    transaction.rollback();
    next(error);
  }
};

exports.addAttendence = async (req, res, next) => {
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
exports.deleteAttendence = async (req, res, next) => {
  const { sequelize } = await dbConn();
  let transaction = await sequelize.transaction();
  try {
    let { businessUuid, userUuid } = req.params;
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

exports.getStaffAttendence = async (req, res, next) => {
  const { sequelize } = await dbConn();
  let transaction = await sequelize.transaction();
  try {
    let { businessUuid, userUuid } = req.params;
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