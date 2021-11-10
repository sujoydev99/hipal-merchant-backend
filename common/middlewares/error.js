const { clean } = require("../functions/clean");
const { logger } = require("../functions/logger");

module.exports = (err, req, res, next) => {
  !err.statusCode ? console.log(err) : null;
  let uri = process.env.APP_BASE_URL;
  let method = req.method;
  return res.status(err.statusCode ? err.statusCode : 500).json(
    clean({
      message: err.customMessage
        ? err.customMessage
        : "Please contact the ADMIN",
      errors: err.errors ? err.errors : null,
      links: { self: `${uri}${req.originalUrl}` },
      method,
    })
  );
};
