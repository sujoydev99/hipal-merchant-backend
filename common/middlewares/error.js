const { clean } = require("../functions/clean");
const { logger } = require("../functions/logger");

module.exports = (err, req, res, next) => {
  console.log(error, JSON.stringify(err));
  !err.statusCode ? console.log(err) : null;
  let uri = process.env.APP_BASE_URL;
  let method = req.method;
  return res.status(err.statusCode ? err.statusCode : 500).json(
    clean({
      message: err.message ? err.message : "Please contact the ADMIN",
      errors: err.errors ? err.errors : null,
      links: { self: `${uri}${req.originalUrl}` },
      method,
    })
  );
};
