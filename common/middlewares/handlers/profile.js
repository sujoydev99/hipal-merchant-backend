const {
  addAddress,
  updateAddressByUuidUserId,
  deleteAddressByUuidUserId,
} = require("../../../repository/userAddresses");
const {
  getUserByUuid,
  updateUserBasicDetailsByUuidUserId,
} = require("../../../repository/user");
const {
  PROFILE_FETCHED,
  NO_ACCOUNT,
  ADDRESS_ADDED,
  ADDRESS_UPDATED,
  ADDRESS_DELETED,
  NOT_ALLOWED,
  BASIC_DETAILS_UPDATED,
} = require("../../constants/messages");
const response = require("../response");
const dbConn = require("../../../models");

exports.getUserByUuid = async (req, res, next) => {
  try {
    const { userUuid } = req.params;
    const user = await getUserByUuid(userUuid);
    if (!user) throw NO_ACCOUNT;
    response(PROFILE_FETCHED, "profile", user, req, res, next);
  } catch (error) {
    next(error);
  }
};

exports.addAddress = async (req, res, next) => {
  const { sequelize } = await dbConn();
  let transaction = await sequelize.transaction();
  try {
    const { userUuid } = req.params;
    await addAddress(
      transaction,
      { ...req.body, userId: req.otherId || req.user.id },
      userUuid
    );
    await transaction.commit();
    response(ADDRESS_ADDED, "address", null, req, res, next);
  } catch (error) {
    await transaction.rollback();
    next(error);
  }
};
exports.updateAddress = async (req, res, next) => {
  const { sequelize } = await dbConn();
  let transaction = await sequelize.transaction();
  try {
    const { userUuid, uuid } = req.params;
    await updateAddressByUuidUserId(
      transaction,
      { ...req.body },
      uuid,
      req.otherId || req.user.id
    );
    await transaction.commit();
    response(ADDRESS_UPDATED, "address", null, req, res, next);
  } catch (error) {
    await transaction.rollback();
    next(error);
  }
};

exports.deleteAddress = async (req, res, next) => {
  const { sequelize } = await dbConn();
  let transaction = await sequelize.transaction();
  try {
    const { uuid } = req.params;
    await deleteAddressByUuidUserId(
      transaction,
      uuid,
      req.otherId || req.user.id
    );
    await transaction.commit();
    response(ADDRESS_DELETED, "address", null, req, res, next);
  } catch (error) {
    await transaction.rollback();
    next(error);
  }
};

exports.updateUserBasicDetails = async (req, res, next) => {
  const { sequelize } = await dbConn();
  let transaction = await sequelize.transaction();
  try {
    const { userUuid } = req.params;
    await updateUserBasicDetailsByUuidUserId(
      transaction,
      { ...req.body },
      userUuid,
      req.otherId || req.user.id
    );
    await transaction.commit();
    response(BASIC_DETAILS_UPDATED, "basic details", null, req, res, next);
  } catch (error) {
    await transaction.rollback();
    next(error);
  }
};
