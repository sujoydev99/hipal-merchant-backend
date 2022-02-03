const {
  SLUG_ALREADY_EXISTS,
  BUSINESS_CREATED,
  BUSINESSES_FETCHED,
  BUSINESS_FETCHED,
  NOT_FOUND,
  BUSINESS_DELETED,
  BUSINESS_UPDATED,
  PROFILE_PICTURE_UPDATED,
  PROFILE_PICTURE_DELETED,
} = require('../../constants/messages');
const response = require('../response');
const dbConn = require('../../../models');
const { uploadPublicDoc } = require('../upload');
const { deleteFile } = require('../../functions/upload');
const { GCS_PUBLIC_BUCKET, CDN_BASE_URL } = require('../../constants/gcs');
const {
  getBusinessBySlug,
  createBusiness,
  getAllBusinessesByUserUuid,
  getBusinessByUuidUserId,
  deleteBusinessById,
  updateBusinessById,
} = require('../../../repository/business');
const {
  createRole,
  createBusinessUserRole,
  deleteRoleByBusinessId,
} = require('../../../repository/role');
const { PRIVILEGES } = require('../../constants/rolesAndPrivileges');

exports.createBusiness = async (req, res, next) => {
  const { sequelize } = await dbConn();
  let transaction = await sequelize.transaction();

  try {
    const { slug } = req.body;
    let existingSlug = await getBusinessBySlug(slug, transaction);
    if (existingSlug) throw SLUG_ALREADY_EXISTS;
    const business = await createBusiness(transaction, req.body);
    const role = await createRole(transaction, {
      businessId: business.id,
      name: 'Owner',
      privileges: [PRIVILEGES.ALL],
    });
    await createBusinessUserRole(transaction, {
      businessId: business.id,
      userId: req.user.id,
      roleId: role.id,
    });
    transaction.commit();
    response(
      BUSINESS_CREATED,
      'business',
      { ...req.body, uuid: business.uuid },
      req,
      res,
      next
    );
  } catch (error) {
    transaction.rollback();
    next(error);
  }
};

exports.getAllBusinessesByUserUuid = async (req, res, next) => {
  try {
    const { userUuid } = req.params;
    let businesses = await getAllBusinessesByUserUuid(userUuid);
    response(BUSINESSES_FETCHED, 'business', businesses, req, res, next);
  } catch (error) {
    next(error);
  }
};

exports.getBusinessByUuid = async (req, res, next) => {
  try {
    const { businessUuid } = req.params;
    let business = await getBusinessByUuidUserId(businessUuid, req.user.id);
    if (!business) throw NOT_FOUND;
    response(BUSINESS_FETCHED, 'business', business, req, res, next);
  } catch (error) {
    next(error);
  }
};
exports.deleteBusinessByUuid = async (req, res, next) => {
  const { sequelize } = await dbConn();
  let transaction = await sequelize.transaction();
  try {
    await updateBusinessById(transaction, business.id, {
      slug: req.business.slug + '---' + new Date(),
    });
    await deleteRoleByBusinessId(transaction, business.id);
    await deleteBusinessById(transaction, business.id);
    transaction.commit();
    response(BUSINESS_DELETED, 'business', {}, req, res, next);
  } catch (error) {
    transaction.rollback();
    next(error);
  }
};
exports.updateBusiness = async (req, res, next) => {
  const { sequelize } = await dbConn();
  let transaction = await sequelize.transaction();
  try {
    const business = await updateBusinessById(
      transaction,
      req.business.id,
      req.body
    );
    transaction.commit();
    response(
      BUSINESS_UPDATED,
      'business',
      business[1].dataValues,
      req,
      res,
      next
    );
  } catch (error) {
    transaction.rollback();
    next(error);
  }
};

exports.uploadBusinessProfilePicture = async (req, res, next) => {
  const { sequelize } = await dbConn();
  let transaction = await sequelize.transaction();
  try {
    const { businessUuid } = req.params;
    let path = `business/${businessUuid}/profilePicture`;
    await uploadPublicDoc(path, req, res, next);
    await updateBusinessById(transaction, req.business.id, {
      profileImageUrl: req.body.path,
    });
    if (req.business.profileImageUrl)
      await deleteFile(req.business.profileImageUrl, GCS_PUBLIC_BUCKET);
    await transaction.commit();
    response(
      PROFILE_PICTURE_UPDATED,
      'profile image',
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
exports.deleteBusinessProfilePicture = async (req, res, next) => {
  const { sequelize } = await dbConn();
  let transaction = await sequelize.transaction();
  try {
    if (!req.business.profileImageUrl) throw NOT_FOUND;
    await updateBusinessById(transaction, req.business.id, {
      profileImageUrl: null,
    });
    await deleteFile(req.business.profileImageUrl, GCS_PUBLIC_BUCKET);
    await transaction.commit();
    response(PROFILE_PICTURE_DELETED, 'profile image', {}, req, res, next);
  } catch (error) {
    await transaction.rollback();
    next(error);
  }
};
