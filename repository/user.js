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
          transaction,
        },
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
        resolve(user);
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
