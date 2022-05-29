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
  BUSINESS_STATS,
  BUSINESS_SALES,
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
  updateBusinessById,
} = require("../../../repository/business");
const {
  createRole,
  createBusinessUserRole,
  deleteRoleByBusinessId,
} = require("../../../repository/role");
const { PRIVILEGES } = require("../../constants/rolesAndPrivileges");
const { Op } = require("sequelize");

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
    response(BUSINESS_CREATED, "business", { ...req.body, uuid: business.uuid }, req, res, next);
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
    let business = await getBusinessByUuidUserId(businessUuid, req.user.id);
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
    await updateBusinessById(transaction, req.business.id, {
      slug: req.business.slug + "---" + new Date(),
    });
    await deleteRoleByBusinessId(transaction, req.business.id);
    await deleteBusinessById(transaction, req.business.id);
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
    const business = await updateBusinessById(transaction, req.business.id, req.body);
    transaction.commit();
    response(BUSINESS_UPDATED, "business", business[1].dataValues, req, res, next);
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
    response(PROFILE_PICTURE_DELETED, "profile image", {}, req, res, next);
  } catch (error) {
    await transaction.rollback();
    next(error);
  }
};
exports.getBusinessStats = async (req, res, next) => {
  try {
    const { sequelize, orders } = await dbConn();
    let { from = new Date(), to = new Date(), type = "DINE-IN,TAKEAWAY,DELIVERY" } = req.query;
    type = type.split(",");
    from = new Date(from);
    to = new Date(to);
    from.setDate(from.getDate() - 30);
    to.setDate(to.getDate() + 1);
    let stats = await orders.findAll({
      where: {
        updatedAt: {
          [Op.between]: [
            (sequelize.fn("date", sequelize.col("updatedAt")), ">=", from),
            (sequelize.fn("date", sequelize.col("updatedAt")), "<=", to),
          ],
        },
        type: type,
        businessId: req.business.id
      },
    });
    let dataObj = {
      paidAmount: 0,
      taxAmount: 0,
      totalAmount: 0,
      discountAmount: 0,
      online: 0,
      cash: 0,
      card: 0,
    };
    for (let i = 0; i < stats.length; i++) {
      dataObj.paidAmount += stats[i].paidAmount || 0;
      dataObj.totalAmount += stats[i].totalAmount || 0;
      dataObj.taxAmount += stats[i].taxAmount || 0;
      dataObj.online += stats[i].paymentData.online || 0;
      dataObj.cash += stats[i].paymentData.cash || 0;
      dataObj.card += stats[i].paymentData.card || 0;
    }
    response(BUSINESS_STATS, "business stats", dataObj, req, res, next);
  } catch (error) {
    next(error);
  }
};

exports.getBusinessSales = async (req, res, next) => {
  try {
    const { sequelize, orders } = await dbConn();
    let {
      from = new Date(),
      to = new Date(),
      type = "DINE-IN,TAKEAWAY,DELIVERY",
      page = 1,
      size = 50,
    } = req.query;
    type = type.split(",");
    from = new Date(from);
    to = new Date(to);
    from.setDate(from.getDate() - 30);
    to.setDate(to.getDate() + 1);
    let stats = await orders.findAndCountAll({
      where: {
        updatedAt: {
          [Op.between]: [
            (sequelize.fn("date", sequelize.col("updatedAt")), ">=", from),
            (sequelize.fn("date", sequelize.col("updatedAt")), "<=", to),
          ],
        },
        type: type,
        businessId: req.business.id
      },
      offset: (page - 1) * size,
      limit: size,
    });
    response(BUSINESS_SALES, "business sales", stats, req, res, next);
  } catch (error) {
    next(error);
  }
};

exports.getBusinessSale = async (req, res, next) => {
  try {
    const { saleUuid } = req.params;
    const { sequelize, orders, orderItems } = await dbConn();
    let stats = await orders.findOne({
      where: {
        uuid: saleUuid,
        businessId: req.business.id
      },
      include:{
        model: orderItems, 
        as:"orderItems"
      }
    });

    response(BUSINESS_SALES, "business sales", stats, req, res, next);
  } catch (error) {
    next(error);
  }
};
