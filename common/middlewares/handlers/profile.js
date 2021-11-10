const {
  addAddress,
  updateAddressByUuidUserId,
  deleteAddressByUuidUserId,
} = require("../../../repository/addresses");
const { getUserByUuid } = require("../../../repository/user");
const {
  PROFILE_FETCHED,
  NO_ACCOUNT,
  ADDRESS_ADDED,
  ADDRESS_UPDATED,
  ADDRESS_DELETED,
} = require("../../constants/messages");
const response = require("../response");
const dbConn = require("../../../models");

exports.getUserByUuid = async (req, res, next) => {
  try {
    const { uuid } = req.params;
    const user = await getUserByUuid(uuid);
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
    const { uuid } = req.params;
    await addAddress(transaction, { ...req.body }, uuid, req.user.uuid);
    response(ADDRESS_ADDED, "address", null, req, res, next);
  } catch (error) {
    next(error);
  }
};
exports.updateAddress = async (req, res, next) => {
  const { sequelize } = await dbConn();
  let transaction = await sequelize.transaction();
  try {
    const { uuid } = req.params;
    await updateAddressByUuidUserId(
      transaction,
      { ...req.body },
      uuid,
      req.user.uuid
    );
    response(ADDRESS_UPDATED, "address", null, req, res, next);
  } catch (error) {
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
      { ...req.body },
      uuid,
      req.user.uuid
    );
    response(ADDRESS_DELETED, "address", null, req, res, next);
  } catch (error) {
    next(error);
  }
};
