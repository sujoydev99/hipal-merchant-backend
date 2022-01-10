const dbConn = require("../models");

exports.getDocByUserId = (userId, type = [], transaction) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { userDocs } = await dbConn();
      const doc = await userDocs.findOne({
        where: { userId, type },
        transaction,
      });
      resolve(doc);
    } catch (error) {
      reject(error);
    }
  });
};

exports.addUserDoc = (transaction, userDocObj) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { userDocs } = await dbConn();
      const doc = await userDocs.create(userDocObj, { transaction });
      resolve(doc);
    } catch (error) {
      reject(error);
    }
  });
};

exports.getUserDocByUuidUserId = (uuid, userId, transaction) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { userDocs } = await dbConn();
      const doc = await userDocs.findOne({
        where: { uuid, userId },
        transaction,
      });
      resolve(doc);
    } catch (error) {
      reject(error);
    }
  });
};
exports.deleteUserDocByUuidUserId = (transaction, uuid, userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { userDocs } = await dbConn();
      await userDocs.destroy({
        where: { uuid, userId },
        transaction,
      });
      resolve();
    } catch (error) {
      reject(error);
    }
  });
};
