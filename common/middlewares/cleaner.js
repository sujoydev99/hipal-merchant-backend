const { clean } = require("../functions/clean");

exports.cleaner = async (req, res, next) => {
  try {
    req.body = clean(req.body);
    next();
  } catch (error) {
    next(error);
  }
};
