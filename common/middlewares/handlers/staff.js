const dbConn = require("../../../models");
const {
  createBusinessUserRole,
  getRoleMetaByUuidBusinessId,
  getRoleMetaByUserIdRoleIdBusinessId,
  updateBusinessUserRole,
  deleteBusinessUserRole,
} = require("../../../repository/role");
const {
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
const { EMAIL } = require("../../constants/variables");
const response = require("../response");

exports.createStaff = async (req, res, next) => {
  const { sequelize } = await dbConn();
  let transaction = await sequelize.transaction();
  try {
    let { type } = req.query;
    let { email, mobileNumber, countryCode, roleUuid } = req.body;
    const user =
      type === EMAIL
        ? await getUserByEmail(email, transaction)
        : await getUserByMobileNumber(mobileNumber, countryCode, transaction);
    if (!user) throw USER_NOT_FOUND;
    const role = await getRoleMetaByUuidBusinessId(
      roleUuid,
      req.business.id,
      transaction
    );
    if (!role) throw ROLE_NOT_FOUND;
    if (role.name.toLowerCase() === "owner") throw SINGLE_OWNER;
    const existingStaff = await getRoleMetaByUserIdRoleIdBusinessId(
      user.id,
      req.business.id,
      transaction
    );
    if (existingStaff) throw STAFF_EXISTS;
    await createBusinessUserRole(transaction, {
      userId: user.id,
      businessId: req.business.id,
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
    const { userUuid, roleUuid } = req.body;
    const user = await getUserMetaByUuid(userUuid, transaction);
    if (!user) throw USER_NOT_FOUND;
    const role = await getRoleMetaByUuidBusinessId(
      roleUuid,
      req.business.id,
      transaction
    );
    if (!role) throw ROLE_NOT_FOUND;
    if (role.name.toLowerCase() === "owner") throw ROLE_FORBIDDEN;
    await updateBusinessUserRole(transaction, {
      userId: user.id,
      businessId: req.business.id,
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
    const staff = await getAllUsersByBusinessId(req.business.id);
    response(STAFF_FETCHED, "staff", staff, req, res, next);
  } catch (error) {
    next(error);
  }
};
exports.getStaff = async (req, res, next) => {
  try {
    let { userUuid } = req.params;
    const user = await getUserByUuidBusinessId(userUuid, req.business.id);
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
    let { userUuid } = req.params;
    const user = await getUserMetaByUuidBusinessId(userUuid, req.business.id);
    if (!user) throw USER_NOT_FOUND;
    if (user.roles[0].name.toLowerCase() === "owner") throw ROLE_FORBIDDEN;
    await deleteBusinessUserRole(transaction, user.id, req.business.id);
    transaction.commit();
    response(STAFF_DELETED, "staff", {}, req, res, next);
  } catch (error) {
    transaction.rollback();
    next(error);
  }
};
