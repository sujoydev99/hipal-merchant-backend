const { default: axios } = require("axios");
const { DEFAULT_MOBILE_OTP } = require("../constants/defaults");
const { OTP_NOT_VERIFIED, OTP_VERIFIED } = require("../constants/messages");
const { DEVELOPMENT } = require("../constants/variables");
const { logger } = require("./logger");

exports.sendMobileOtp = (number, code) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (process.env.ENVIRONMENT === DEVELOPMENT)
        return resolve(DEFAULT_MOBILE_OTP);
      let response = await axios.get(
        `${process.env.MSG_91_BASE_URL}?authkey=${process.env.MSG_91_API_KEY}&otp_length=4&mobile=${code}${number}&otp_expiry=15&template_id=6016b84640f7da229d3d1943`
      );
      resolve(response.data);
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};

exports.verifyMobileOtp = (number, code, otp) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (process.env.ENVIRONMENT === DEVELOPMENT)
        if (otp === DEFAULT_MOBILE_OTP) return resolve(OTP_VERIFIED);
        else return reject(OTP_NOT_VERIFIED);
      let response = await axios.get(
        `${process.env.MSG_91_BASE_URL}/verify?authkey=${process.env.MSG_91_API_KEY}&mobile=${code}${number}&otp=${otp}`
      );
      if (
        response.data.message === "Mobile no. already verified" ||
        response.data.message === "OTP verified success"
      ) {
        resolve();
        return;
      }
      logger.info(response.data.message);
      reject({
        code: 400,
        customMessage: response.data.message,
      });
    } catch (error) {
      reject(error);
    }
  });
};

exports.resendOtp = (number, code, type) => {
  return new Promise(async (resolve, reject) => {
    try {
      let response = await axios.get(
        `${process.env.MSG_91_BASE_URL}/retry?authkey=${process.env.MSG_91_API_KEY}&mobile=${code}${number}&retrytype=${type}`
      );
      logger.info("response\t otp\t number");
      logger.info(`${JSON.stringify(response.data)}\t ${code}${number}`);
      resolve(response.data);
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};
