const { DEFAULT_EXCLUDE } = require("../common/constants/attributes");
const {
  EMAIL_ALREADY_EXISTS,
  NO_ACCOUNT,
} = require("../common/constants/messages");
const dbConn = require("../models");

exports.getOrCreateUserByMobileNumber = (
  transaction,
  extension,
  number,
  otp = 123456
) => {
  return new Promise(async (resolve, reject) => {
    const { users, userContactNumbers } = await dbConn();
    try {
      let user = await users.findOne({
        include: {
          model: userContactNumbers,
          as: "userContactNumbers",
          required: "true",
          where: { extension, number },
          transaction,
        },
      });
      if (!user) {
        const newUser = await users.create({}, { transaction });
        const contactNumber = await userContactNumbers.create(
          {
            extension,
            number,
            userId: newUser.id,
            otp,
            isActive: true,
          },
          { transaction }
        );
        user = {
          ...newUser.dataValues,
          userContactNumbers: newUser.userContactNumbers
            ? newUser.userContactNumbers.push(contactNumber)
            : [contactNumber],
        };
      }
      resolve(user);
    } catch (error) {
      reject(error);
    }
  });
};
exports.getOrCreateUserByEmail = (transaction, email, password = null) => {
  return new Promise(async (resolve, reject) => {
    const { users, userEmails } = await dbConn();
    try {
      let user = await users.findOne({
        include: {
          model: userEmails,
          as: "userEmails",
          required: "true",
          where: { email },
        },
        transaction,
      });
      if (!user && password) {
        const newUser = await users.create({ password }, { transaction });
        const _email = await userEmails.create(
          {
            email,
            userId: newUser.id,
            isActive: true,
          },
          { transaction }
        );
        user = {
          ...newUser.dataValues,
          userEmails: newUser.userEmails
            ? newUser.userEmails.push(_email)
            : [_email],
        };
        return resolve(user);
      }
      if (!user && !password) throw NO_ACCOUNT;
      if (user) return resolve(user);
      else throw EMAIL_ALREADY_EXISTS;
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
      const { users } = await dbConn();
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

exports.updateUserById = (transaction, id, obj = {}) => {
  return new Promise(async (resolve, reject) => {
    const { users } = await dbConn();
    let updateFilter = { id };
    try {
      await users.update(obj, {
        where: updateFilter,
        transaction,
      });
      resolve();
    } catch (error) {
      reject(error);
    }
  });
};

exports.getUserByEmail = (email, transaction) => {
  return new Promise(async (resolve, reject) => {
    const { users, userEmails } = await dbConn();
    try {
      let user = await users.findOne({
        include: {
          model: userEmails,
          as: "userEmails",
          required: true,
          where: { email },
        },
        transaction,
      });
      console.log(user);
      return resolve(user);
    } catch (error) {
      reject(error);
    }
  });
};

exports.getUserByMobileNumber = (number, extension, transaction) => {
  return new Promise(async (resolve, reject) => {
    const { users, userContactNumbers } = await dbConn();
    try {
      let user = await users.findOne({
        include: {
          model: userContactNumbers,
          as: "userContactNumbers",
          required: true,
          where: { extension, number },
        },
        transaction,
      });
      return resolve(user);
    } catch (error) {
      reject(error);
    }
  });
};

exports.getAllUsersByBusinessId = (id, transaction) => {
  return new Promise(async (resolve, reject) => {
    const { users, businesses, userEmails, userContactNumbers, roles } =
      await dbConn();
    try {
      let user = await users.findAll({
        attributes: { exclude: DEFAULT_EXCLUDE },
        include: [
          {
            model: businesses,
            as: "businesses",
            required: true,
            where: { id },
            attributes: [],
          },
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
            model: roles,
            as: "roles",
            attributes: ["name", "uuid"],
          },
        ],
        transaction,
      });
      return resolve(user);
    } catch (error) {
      reject(error);
    }
  });
};

exports.getUserMetaByUuid = (uuid, transaction) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { users } = await dbConn();
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

exports.getUserByUuidBusinessId = (uuid, id, transaction) => {
  return new Promise(async (resolve, reject) => {
    const { users, businesses, userEmails, userContactNumbers, roles } =
      await dbConn();
    try {
      let user = await users.findOne({
        where: { uuid },
        attributes: { exclude: DEFAULT_EXCLUDE },
        include: [
          {
            model: businesses,
            as: "businesses",
            required: true,
            where: { id },
            attributes: [],
          },
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
            model: roles,
            as: "roles",
            attributes: ["name"],
          },
        ],
        transaction,
      });
      return resolve(user);
    } catch (error) {
      reject(error);
    }
  });
};
exports.getUserMetaByUuidBusinessId = (uuid, id, transaction) => {
  return new Promise(async (resolve, reject) => {
    const { users, businesses, userEmails, userContactNumbers, roles } =
      await dbConn();
    try {
      let user = await users.findOne({
        where: { uuid },
        include: [
          {
            model: businesses,
            as: "businesses",
            required: true,
            where: { id },
            attributes: [],
          },
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
            model: roles,
            as: "roles",
            attributes: ["name"],
          },
        ],
        transaction,
      });
      return resolve(user);
    } catch (error) {
      reject(error);
    }
  });
};
