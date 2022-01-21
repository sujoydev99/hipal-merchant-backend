const {
  SLUG_ALREADY_EXISTS,
  BUSINESS_CREATED,
  BUSINESSES_FETCHED,
  BUSINESS_FETCHED,
  NOT_FOUND,
  BUSINESS_DELETED,
  ADDRESS_UPDATED,
  BUSINESS_UPDATED,
} = require("../../constants/messages");
const response = require("../response");
const dbConn = require("../../../models");
const { uploadPublicDoc } = require("../upload");
const { deleteFile } = require("../../functions/upload");
const { GCS_PUBLIC_BUCKET, CDN_BASE_URL } = require("../../constants/gcs");
const {
  getBusinessBySlug,
  createBusiness,
  getAllBusinessesByUserUuid,
  getBusinessByUuidUserId,
  deleteBusinessById,
  getBusinessMetaByUuidUserId,
  updateBusinessById,
} = require("../../../repository/business");
const {
  createRole,
  createBusinessUserRole,
  deleteRoleByBusinessId,
} = require("../../../repository/role");
const { PRIVILEGES } = require("../../constants/rolesAndPrivileges");
const businesses = require("../../../models/businesses");

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
      name: "Owner",
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
      "business",
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
    response(BUSINESSES_FETCHED, "business", businesses, req, res, next);
  } catch (error) {
    next(error);
  }
};

exports.getBusinessByUuid = async (req, res, next) => {
  try {
    const { businessUuid } = req.params;
    let business = await getBusinessByUuidUserId(
      businessUuid,
      req.user.userTypes.indexOf("ADMIN") > -1 ? null : req.user.id
    );
    if (!business) throw NOT_FOUND;
    response(BUSINESS_FETCHED, "business", business, req, res, next);
  } catch (error) {
    next(error);
  }
};
exports.deleteBusinessByUuid = async (req, res, next) => {
  const { sequelize } = await dbConn();
  let transaction = await sequelize.transaction();
  try {
    const { businessUuid } = req.params;
    const business = await getBusinessMetaByUuidUserId(
      businessUuid,
      req.user.userTypes.indexOf("ADMIN") > -1 ? null : req.user.id
    );
    if (business) {
      await updateBusinessById(transaction, business.id, {
        slug: business.slug + "---" + new Date(),
      });
      await deleteRoleByBusinessId(transaction, business.id);
      await deleteBusinessById(transaction, business.id);
    } else throw NOT_FOUND;
    transaction.commit();
    response(BUSINESS_DELETED, "business", {}, req, res, next);
  } catch (error) {
    transaction.rollback();
    next(error);
  }
};
exports.updateBusiness = async (req, res, next) => {
  const { sequelize } = await dbConn();
  let transaction = await sequelize.transaction();
  try {
    const { businessUuid } = req.params;
    const business = await getBusinessMetaByUuidUserId(
      businessUuid,
      req.user.userTypes.indexOf("ADMIN") > -1 ? null : req.user.id
    );
    if (business) {
      await updateBusinessById(transaction, business.id, req.body);
    } else throw NOT_FOUND;
    transaction.commit();
    response(BUSINESS_UPDATED, "business", {}, req, res, next);
  } catch (error) {
    transaction.rollback();
    next(error);
  }
};
