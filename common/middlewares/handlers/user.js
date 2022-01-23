const {
  addAddress,
  updateAddressByUuidUserId,
  deleteAddressByUuidUserId,
} = require("../../../repository/userAddresses");
const {
  getUserByUuid,
  updateUserBasicDetailsByUuidUserId,
  getUserByUuidReq,
} = require("../../../repository/user");
const {
  PROFILE_FETCHED,
  NO_ACCOUNT,
  ADDRESS_ADDED,
  ADDRESS_UPDATED,
  ADDRESS_DELETED,
  BASIC_DETAILS_UPDATED,
  PROFILE_PICTURE_UPDATED,
  NOT_FOUND,
  PROFILE_PICTURE_DELETED,
  PASSWORD_UPDATED,
  PREVOIUS_PASSWORD,
} = require("../../constants/messages");
const response = require("../response");
const dbConn = require("../../../models");
const { uploadPublicDoc } = require("../upload");
const { deleteFile } = require("../../functions/upload");
const { GCS_PUBLIC_BUCKET, CDN_BASE_URL } = require("../../constants/gcs");
const { comparepw, hash } = require("../../functions/bcrypt");

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
exports.uploadUserProfilePicture = async (req, res, next) => {
  const { sequelize } = await dbConn();
  let transaction = await sequelize.transaction();
  try {
    const { userUuid } = req.params;
    const user = await getUserByUuidReq(userUuid);
    let path = `users/${userUuid}/profilePicture`;
    await uploadPublicDoc(path, req, res, next);
    await updateUserBasicDetailsByUuidUserId(
      transaction,
      { profileImageUrl: req.body.path },
      userUuid,
      req.otherId || req.user.id
    );
    if (user.profileImageUrl)
      await deleteFile(user.profileImageUrl, GCS_PUBLIC_BUCKET);
    await transaction.commit();
    response(
      PROFILE_PICTURE_UPDATED,
      "profile image",
      { url: `${CDN_BASE_URL}/${req.body.path}` },
      req,
      res,
      next
    );
  } catch (error) {
    await transaction.rollback();
    next(error);
  }
};
exports.deleteUserProfilePicture = async (req, res, next) => {
  const { sequelize } = await dbConn();
  let transaction = await sequelize.transaction();
  try {
    const { userUuid } = req.params;
    const user = await getUserByUuidReq(userUuid);
    if (!user.profileImageUrl) throw NOT_FOUND;
    await updateUserBasicDetailsByUuidUserId(
      transaction,
      { profileImageUrl: null },
      userUuid,
      req.otherId || req.user.id
    );
    await deleteFile(user.profileImageUrl, GCS_PUBLIC_BUCKET);
    await transaction.commit();
    response(PROFILE_PICTURE_DELETED, "profile image", {}, req, res, next);
  } catch (error) {
    await transaction.rollback();
    next(error);
  }
};
exports.updateUserPassword = async (req, res, next) => {
  const { sequelize } = await dbConn();
  let transaction = await sequelize.transaction();
  try {
    const { userUuid } = req.params;
    const { oldPassword, password } = req.body;
    const user = await getUserByUuidReq(userUuid);
    if (user.password) {
      if (!oldPassword) throw PREVOIUS_PASSWORD;
      await comparepw(oldPassword, user.password);
    }
    await updateUserBasicDetailsByUuidUserId(
      transaction,
      { password: await hash(password) },
      userUuid,
      req.otherId || req.user.id
    );
    await transaction.commit();
    response(PASSWORD_UPDATED, "password", {}, req, res, next);
  } catch (error) {
    await transaction.rollback();
    next(error);
  }
};
