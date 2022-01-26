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
  updateBusinessUserRole,
  deleteBusinessUserRole,
} = require("../../../repository/role");
const {
  getOrCreateUserByEmail,
  getUserByEmail,
  getUserByMobileNumber,
  getAllUsersByBusinessId,
  getUserMetaByUuid,
  getUserByUuidBusinessId,
  getUserMetaByUuidBusinessId,
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
  ROLE_FORBIDDEN,
  SINGLE_OWNER,
  STAFF_DELETED,
} = require("../../constants/messages");
const { PRIVILEGES } = require("../../constants/rolesAndPrivileges");
const { EMAIL } = require("../../constants/variables");
const response = require("../response");
const { getUserByUuid } = require("./user");

exports.createStaff = async (req, res, next) => {
  const { sequelize } = await dbConn();
  let transaction = await sequelize.transaction();
  try {
    let { businessUuid } = req.params;
    let { type } = req.query;
    let { email, mobileNumber, countryCode, roleUuid } = req.body;
    let business = await getBusinessMetaByUuidUserId(
      businessUuid,
      req.user.id,
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
    if (role.name.toLowerCase() === "owner") throw SINGLE_OWNER;
    const existingStaff = await getRoleMetaByUserIdRoleIdBusinessId(
      user.id,
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
    let { businessUuid } = req.params;
    const { userUuid, roleUuid } = req.body;
    let business = await getBusinessMetaByUuidUserId(
      businessUuid,
      req.user.id,
      transaction
    );
    if (!business) throw NOT_FOUND;
    const user = await getUserMetaByUuid(userUuid, transaction);
    if (!user) throw USER_NOT_FOUND;
    const role = await getRoleMetaByUuidBusinessId(
      roleUuid,
      business.id,
      transaction
    );
    if (!role) throw ROLE_NOT_FOUND;
    if (role.name.toLowerCase() === "owner") throw ROLE_FORBIDDEN;
    await updateBusinessUserRole(transaction, {
      userId: user.id,
      businessId: business.id,
      roleId: role.id,
    });
    transaction.commit();
    response(ROLE_UPDATED, "staff", {}, req, res, next);
  } catch (error) {
    transaction.rollback();
    next(error);
  }
};
exports.getAllBusinessStaff = async (req, res, next) => {
  try {
    let { businessUuid } = req.params;
    let business = await getBusinessMetaByUuidUserId(businessUuid, req.user.id);
    if (!business) throw NOT_FOUND;
    const staff = await getAllUsersByBusinessId(business.id);
    response(STAFF_FETCHED, "staff", staff, req, res, next);
  } catch (error) {
    next(error);
  }
};
exports.getStaff = async (req, res, next) => {
  try {
    let { businessUuid, userUuid } = req.params;
    let business = await getBusinessMetaByUuidUserId(businessUuid, req.user.id);
    if (!business) throw NOT_FOUND;
    const user = await getUserByUuidBusinessId(userUuid, business.id);
    if (!user) throw NOT_FOUND;
    response(STAFF_FETCHED, "staff", user, req, res, next);
  } catch (error) {
    next(error);
  }
};
exports.deleteStaff = async (req, res, next) => {
  const { sequelize } = await dbConn();
  let transaction = await sequelize.transaction();
  try {
    let { businessUuid, userUuid } = req.params;
    let business = await getBusinessMetaByUuidUserId(businessUuid, req.user.id);
    if (!business) throw NOT_FOUND;
    const user = await getUserMetaByUuidBusinessId(userUuid, business.id);
    if (!user) throw USER_NOT_FOUND;
    if (user.roles[0].name.toLowerCase() === "owner") throw ROLE_FORBIDDEN;
    await deleteBusinessUserRole(transaction, user.id, business.id);
    transaction.commit();
    response(STAFF_DELETED, "staff", {}, req, res, next);
  } catch (error) {
    transaction.rollback();
    next(error);
  }
};
