const {
  SLUG_ALREADY_EXISTS,
  BUSINESS_CREATED,
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
} = require("../../../repository/business");
const {
  createRole,
  createBusinessUserRole,
} = require("../../../repository/role");
const { PRIVILEGES } = require("../../constants/rolesAndPrivileges");

exports.createBusiness = async (req, res, next) => {
  const { sequelize } = await dbConn();
  let transaction = await sequelize.transaction();

  try {
    const { slug } = req.body;
    let cuisineArray = [];
    req.body.cuisine.map((i) => {
      if (cuisineArray.indexOf(i.tag) === -1) cuisineArray.push(i.tag);
    });
    req.body.cuisine = cuisineArray;
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
  const { sequelize } = await dbConn();
  let transaction = await sequelize.transaction();
  try {
    const { userUuid } = req.params;
    let businesses = await getAllBusinessesByUserUuid(userUuid);
    response(BUSINESS_CREATED, "business", businesses, req, res, next);
  } catch (error) {
    transaction.rollback();
    next(error);
  }
};
