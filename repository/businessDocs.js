const dbConn = require("../models");

exports.getDocByBusinessId = (businessId, type = [], transaction) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { businessDocs } = await dbConn();
      const doc = await businessDocs.findOne({
        where: { businessId, type },
        transaction,
      });
      resolve(doc);
    } catch (error) {
      reject(error);
    }
  });
};

exports.addbusinessDoc = (transaction, businessDocObj) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { businessDocs } = await dbConn();
      const doc = await businessDocs.create(businessDocObj, { transaction });
      resolve(doc);
    } catch (error) {
      reject(error);
    }
  });
};

exports.getBusinessDocByUuidBusinessId = (uuid, businessId, transaction) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { businessDocs } = await dbConn();
      const doc = await businessDocs.findOne({
        where: { uuid, businessId },
        transaction,
      });
      resolve(doc);
    } catch (error) {
      reject(error);
    }
  });
};
exports.deleteBusinessDocByUuidBusinessId = (transaction, uuid, businessId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { businessDocs } = await dbConn();
      await businessDocs.destroy({
        where: { uuid, businessId },
        transaction,
      });
      resolve();
    } catch (error) {
      reject(error);
    }
  });
};
