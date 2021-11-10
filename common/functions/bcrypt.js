const bcrypt = require("bcryptjs");
const { INVALID_PASSWORD } = require("../constants/messages");
exports.hash = (password) => {
  return new Promise(async (resolve, reject) => {
    try {
      let salt = bcrypt.genSaltSync(10);
      bcrypt.hash(password, salt, function (err, hash) {
        if (err) return reject(error);
        resolve(hash);
      });
    } catch (error) {
      reject(error);
    }
  });
};
exports.comparepw = (password, hashedPassword) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (bcrypt.compareSync(password, hashedPassword)) resolve();
      else throw INVALID_PASSWORD;
    } catch (error) {
      reject(error);
    }
  });
};
