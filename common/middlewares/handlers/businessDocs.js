const { nanoid } = require("nanoid");
const dbConn = require("../../../models");
const {
  getDocByBusinessId,
  addbusinessDoc,
  getBusinessDocByUuidBusinessId,
  deleteBusinessDocByUuidBusinessId,
} = require("../../../repository/businessDocs");
const { GCS_PRIVATE_BUCKET } = require("../../constants/gcs");
const {
  DOC_EXISTS,
  DOC_UPLOADED,
  PRIVATE_DOC_FETCHED,
  PRIVATE_DOC_DELETED,
  NOT_FOUND,
} = require("../../constants/messages");
const {
  generateV4ReadSignedUrl,
  deleteFile,
} = require("../../functions/upload");
const response = require("../response");
const { uploadPrivateDoc } = require("../upload");

exports.uploadBusinessDoc = async (req, res, next) => {
  const { sequelize } = await dbConn();
  let transaction = await sequelize.transaction();
  try {
    console.log(req.file);
    const { type } = req.body;
    const { businessUuid } = req.params;
    let existingDoc = await getDocByBusinessId(
      business.id,
      [type],
      transaction
    );
    if (existingDoc) throw DOC_EXISTS;
    let path = `business/${businessUuid}/businessDocs/${type}`;
    await uploadPrivateDoc(path, req, res, next);
    let doc = await addbusinessDoc(transaction, {
      businessId: req.business.id,
      ...req.body,
    });
    transaction.commit();
    response(
      DOC_UPLOADED,
      "document",
      { ...req.body, uuid: doc.uuid },
      req,
      res,
      next
    );
  } catch (error) {
    transaction.rollback();
    next(error);
  }
};

exports.getBusinessDoc = async (req, res, next) => {
  try {
    let { uuid } = req.params;
    const doc = await getBusinessDocByUuidBusinessId(uuid, req.business.id);
    if (!doc) throw NOT_FOUND;
    const url = await generateV4ReadSignedUrl(doc.path);
    response(PRIVATE_DOC_FETCHED, "document", { url }, req, res, next);
  } catch (error) {
    next(error);
  }
};
exports.deleteBusinessDoc = async (req, res, next) => {
  const { sequelize } = await dbConn();
  let transaction = await sequelize.transaction();
  try {
    let { uuid } = req.params;
    const doc = await getBusinessDocByUuidBusinessId(uuid, req.business.id);
    if (!doc) throw NOT_FOUND;
    await deleteBusinessDocByUuidBusinessId(transaction, uuid, business.id);
    await deleteFile(doc.path, GCS_PRIVATE_BUCKET);
    transaction.commit();
    response(PRIVATE_DOC_DELETED, "document", {}, req, res, next);
  } catch (error) {
    transaction.rollback();
    next(error);
  }
};
