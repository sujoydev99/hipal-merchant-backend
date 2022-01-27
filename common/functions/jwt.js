const jwt = require("jsonwebtoken");
exports.jwtSign = (token) => {
  token = JSON.parse(JSON.stringify(token));
  token = { uuid: token.uuid };
  return {
    token: `Bearer ${jwt.sign(token, process.env.JWT_SECRET, {
      expiresIn: "7d",
    })}`,
  };
};

exports.jwtVerify = (req) => {
  try {
    let token = req.headers["authorization"]
      ? req.headers["authorization"]
      : req.headers["Authorization"];
    return jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
  } catch (error) {
    throw {
      customMessage: error,
      statusCode: 401,
    };
  }
};
