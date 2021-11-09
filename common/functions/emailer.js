const { customAlphabet } = require("nanoid");

exports.sendEmailOtp = (email) => {
  return new Promise(async (resolve, reject) => {
    try {
      const otp = customAlphabet("1234567890", 6);
      if (process.env.ENVIRONMENT === DEVELOPMENT) return resolve(DEFAULT_OTP);
      // let response = await axios.get(
      //   `${process.env.MSG_91_BASE_URL}?authkey=${process.env.MSG_91_API_KEY}&otp_length=4&mobile=${code}${number}&otp_expiry=15&template_id=6016b84640f7da229d3d1943`
      // );
      resolve(response.data);
    } catch (error) {
      reject(error);
    }
  });
};
