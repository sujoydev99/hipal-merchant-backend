const { nanoid } = require("nanoid");
const dbConn = require("../../../models");
const {
  getDocByUserId,
  addUserDoc,
  getUserDocByUuid,
  getUserDocByUuidUserId,
  deleteUserDocByUuidUserId,
} = require("../../../repository/userDocs");
const { GCS_PRIVATE_BUCKET } = require("../../constants/gcs");
const {
  DOC_EXISTS,
  DOC_UPLOADED,
  PRIVATE_DOC_FETCHED,
  PRIVATE_DOC_DELETED,
  NOT_FOUND,
} = require("../../constants/messages");
const {
  generateV4UploadSignedUrl,
  generateV4ReadSignedUrl,
  deleteFile,
} = require("../../functions/upload");
const response = require("../response");
const { uploadPrivateDoc } = require("../upload");

exports.uploadUserDoc = async (req, res, next) => {
  const { sequelize } = await dbConn();
  let transaction = await sequelize.transaction();
  try {
    let { type } = req.body;
    let existingDoc = await getDocByUserId(req.otherId || req.user.id, [type]);
    if (existingDoc) throw DOC_EXISTS;
    let path = `userDocs/${req.body.type}`;
    await uploadPrivateDoc(path, req, res, next);
    let doc = await addUserDoc(transaction, {
      userId: req.otherId || req.user.id,
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

exports.getUserDoc = async (req, res, next) => {
  try {
    let { uuid } = req.params;
    let doc = await getUserDocByUuidUserId(uuid, req.otherId || req.user.id);
    let url = await generateV4ReadSignedUrl(doc.path);
    response(PRIVATE_DOC_FETCHED, "document", { url }, req, res, next);
  } catch (error) {
    next(error);
  }
};
exports.deleteUserDoc = async (req, res, next) => {
  const { sequelize } = await dbConn();
  let transaction = await sequelize.transaction();
  try {
    let { uuid } = req.params;
    let doc = await getUserDocByUuidUserId(
      uuid,
      req.otherId || req.user.id,
      transaction
    );
    if (!doc) throw NOT_FOUND;
    await deleteUserDocByUuidUserId(
      transaction,
      uuid,
      req.otherId || req.user.id
    );
    await deleteFile(doc.path, GCS_PRIVATE_BUCKET);
    transaction.commit();
    response(PRIVATE_DOC_DELETED, "document", {}, req, res, next);
  } catch (error) {
    transaction.rollback();
    next(error);
  }
};
