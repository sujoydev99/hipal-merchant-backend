const { DEFAULT_EXCLUDE } = require("../common/constants/attributes");
const {
  EMAIL_ALREADY_EXISTS,
  NO_ACCOUNT,
} = require("../common/constants/messages");
const dbConn = require("../models");

exports.getBusinessBySlug = (slug, transaction) => {
  return new Promise(async (resolve, reject) => {
    const { businesses } = await dbConn();
    try {
      let business = await businesses.findOne({ where: { slug }, transaction });
      resolve(business);
    } catch (error) {
      reject(error);
    }
  });
};
exports.createRole = (transaction, roleObj) => {
  return new Promise(async (resolve, reject) => {
    const { roles } = await dbConn();
    try {
      const role = await roles.create(roleObj, { transaction });
      resolve(role);
    } catch (error) {
      reject(error);
    }
  });
};
exports.createBusinessUserRole = (transaction, roleObj) => {
  return new Promise(async (resolve, reject) => {
    const { businessUserRoles } = await dbConn();
    try {
      const role = await businessUserRoles.create(roleObj, { transaction });
      resolve(role);
    } catch (error) {
      reject(error);
    }
  });
};
exports.getUserByUuid = (uuid, transaction) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { users, userEmails, userContactNumbers, userDocs, userAddresses } =
        await dbConn();
      const user = await users.findOne({
        where: { uuid },
        attributes: { exclude: DEFAULT_EXCLUDE },
        include: [
          {
            model: userEmails,
            as: "userEmails",
            attributes: { exclude: DEFAULT_EXCLUDE },
          },
          {
            model: userContactNumbers,
            as: "userContactNumbers",
            attributes: { exclude: DEFAULT_EXCLUDE },
          },
          {
            model: userDocs,
            as: "userDocs",
            attributes: { exclude: DEFAULT_EXCLUDE },
          },
          {
            model: userAddresses,
            as: "userAddresses",
            attributes: { exclude: DEFAULT_EXCLUDE },
          },
        ],
        transaction,
      });
      resolve(user);
    } catch (error) {
      reject(error);
    }
  });
};

exports.getUserByUuidReq = (uuid, transaction) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { users, userEmails, userContactNumbers, userDocs, userAddresses } =
        await dbConn();
      const user = await users.findOne({
        where: { uuid },
        transaction,
      });
      resolve(user);
    } catch (error) {
      reject(error);
    }
  });
};

exports.updateUserBasicDetailsByUuidUserId = (
  transaction,
  userObj,
  uuid,
  id
) => {
  return new Promise(async (resolve, reject) => {
    const { users } = await dbConn();
    let updateFilter = { uuid, id };
    try {
      await users.update(userObj, {
        where: updateFilter,
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
    try {
      let k = await userAddresses.update(addrObj, {
        where: updateFilter,
        transaction,
      });
      resolve();
    } catch (error) {
      reject(error);
    }
  });
};
