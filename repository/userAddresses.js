const {
  EMAIL_ALREADY_EXISTS,
  NO_ACCOUNT,
} = require("../common/constants/messages");
const dbConn = require("../models");

exports.addAddress = (transaction, addrObj) => {
  return new Promise(async (resolve, reject) => {
    const { userAddresses, users } = await dbConn();
    try {
      await userAddresses.create(addrObj, { transaction });
      resolve();
    } catch (error) {
      reject(error);
    }
  });
};
exports.deleteAddressByUuidUserId = (transaction, uuid, userId) => {
  return new Promise(async (resolve, reject) => {
    const { userAddresses } = await dbConn();
    try {
      let deleteFilter = { uuid };
      await userAddresses.destroy({
        where: deleteFilter,
        transaction,
      });
      resolve();
    } catch (error) {
      reject(error);
    }
  });
};
exports.updateAddressByUuidUserId = (transaction, addrObj, uuid, userId) => {
  return new Promise(async (resolve, reject) => {
    const { userAddresses } = await dbConn();
    let updateFilter = { uuid, userId };
    console.log(updateFilter, addrObj, transaction);
    try {
      let k = await userAddresses.update(addrObj, {
        where: updateFilter,
        transaction,
      });
      console.log(k);
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
      const { userAddresses } = await dbConn();
      const address = await userAddresses.findOne({
        where: getFilter,
        transaction,
      });
      resolve(address);
    } catch (error) {
      reject(error);
    }
  });
};
