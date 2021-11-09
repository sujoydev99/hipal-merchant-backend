const bcrypt = require("bcryptjs");
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
