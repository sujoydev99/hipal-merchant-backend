const {
  EMAIL_ALREADY_EXISTS,
  NO_ACCOUNT,
} = require("../common/constants/messages");
const dbConn = require("../models");

exports.addAddress = (transaction, addrObj, userUuid) => {
  return new Promise(async (resolve, reject) => {
    const { addresses, users } = await dbConn();
    try {
      let user = users.findOne({ where: { uuid: userUuid }, transaction });
      await addresses.create({ userId: user.id, ...addrObj }, { transaction });
      resolve();
    } catch (error) {
      reject(error);
    }
  });
};
exports.deleteAddressByUuidUserId = (transaction, uuid, userUuid) => {
  return new Promise(async (resolve, reject) => {
    const { addresses, users } = await dbConn();

    try {
      let user = users.findOne({ where: { uuid: userUuid }, transaction });
      let deleteFilter = { uuid, userId: user.userId };
      await addresses.destroy(
        {
          where: deleteFilter,
        },
        { transaction }
      );
      resolve();
    } catch (error) {
      reject(error);
    }
  });
};
exports.updateAddressByUuidUserId = (transaction, addrObj, uuid, userUuid) => {
  return new Promise(async (resolve, reject) => {
    const { addresses, users } = await dbConn();
    let user = users.findOne({ where: { uuid: userUuid }, transaction });
    let updateFilter = { uuid, userId: user.userId };
    try {
      await addresses.updateOne(
        { addrObj },
        {
          where: updateFilter,
        },
        { transaction }
      );
      resolve();
    } catch (error) {
      reject(error);
    }
  });
};
exports.getAddressUuid = (uuid, userUuid, transaction) => {
  return new Promise(async (resolve, reject) => {
    try {
      let getFilter = { uuid, userId: userUuid };
      const { addresses } = await dbConn();
      const address = await addresses.findOne({
        where: getFilter,
        transaction,
      });
      resolve(address);
    } catch (error) {
      reject(error);
    }
  });
};
