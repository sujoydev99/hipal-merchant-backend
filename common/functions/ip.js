const { default: axios } = require("axios");

exports.getLoc = async (req) => {
  return new Promise(async (resolve, reject) => {
    try {
      let response = await axios.get(
        `${process.env.IP_DATA_BASE_URL}/${req.headers["x-forwarded-for"]}?fields=country,countryCode,region,regionName,timezone,currency,query,zip,city`
      );
      resolve(response.data);
    } catch (error) {
      reject(error);
    }
  });
};
