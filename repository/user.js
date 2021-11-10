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
    const { users, contactNumbers } = await dbConn();
    try {
      let user = await users.findOne({
        include: {
          model: contactNumbers,
          as: "contactNumbers",
          required: "true",
          where: { extension, number },
          transaction,
        },
      });
      if (!user) {
        const newUser = await users.create({}, { transaction });
        const contactNumber = await contactNumbers.create(
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
          contactNumbers: newUser.contactNumbers
            ? newUser.contactNumbers.push(contactNumber)
            : [contactNumber],
        };
      }
      throw "zdc";
      resolve(user);
    } catch (error) {
      reject(error);
    }
  });
};
exports.getOrCreateUserByEmail = (transaction, email, password = null) => {
  return new Promise(async (resolve, reject) => {
    const { users, emails } = await dbConn();
    try {
      let user = await users.findOne({
        include: {
          model: emails,
          as: "emails",
          required: "true",
          where: { email },
          transaction,
        },
      });
      if (!user && password) {
        const newUser = await users.create({ password }, { transaction });
        const _email = await emails.create(
          {
            email,
            userId: newUser.id,
            isActive: true,
          },
          { transaction }
        );
        user = {
          ...newUser.dataValues,
          emails: newUser.emails ? newUser.emails.push(_email) : [_email],
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
      const { users, emails, contactNumbers, docs, addresses } = await dbConn();
      const user = await users.findOne({
        where: { uuid },
        include: [
          {
            model: emails,
            as: "emails",
          },
          {
            model: contactNumbers,
            as: "contactNumbers",
          },
          {
            model: docs,
            as: "docs",
          },
          {
            model: addresses,
            as: "addresses",
          },
        ],
      });
      resolve(user);
    } catch (error) {
      reject(error);
    }
  });
};
