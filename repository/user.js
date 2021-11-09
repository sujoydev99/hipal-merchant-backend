const { EMAIL_ALREADY_EXISTS } = require("../common/constants/messages");
const User = require("../models/user");

exports.getOrCreateUserByMobileNumber = (extension, number, otp = 123456) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await User.findOne({
        contactNumbers: {
          $elemMatch: { extension, number, otp },
        },
      });
      if (!user) {
        const newUser = new User({
          contactNumbers: [{ extension, number, otp, isVerified: true }],
        });
        user = await newUser.save();
      }
      resolve(user);
    } catch (error) {
      reject(error);
    }
  });
};
exports.getOrCreateUserByEmail = (email, password = null) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await User.findOne({
        emails: {
          $elemMatch: { email },
        },
      });
      if (!user && password) {
        const newUser = new User({
          emails: [{ email }],
          password,
        });
        user = await newUser.save();
        resolve(user);
      } else throw EMAIL_ALREADY_EXISTS;
    } catch (error) {
      reject(error);
    }
  });
};
