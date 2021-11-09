const { addRequestLog } = require("../../repository/requestLog");

exports.requestLogger = (req, res, next) => {
  var originalSend = res.send;
  res.send = function sendOverWrite(body) {
    originalSend.call(this, body);
    this.__custombody__ = body;
  };

  res.on("close", async () => {
    let startTime = req._startTime;
    let endTime = new Date();
    let logData = {
      reqBody: req.body,
      reqParams: req.params,
      reqQuery: req.query,
      reqMethod: req.method,
      reqHeaders: req.headers,
      reqUrl: req.originalUrl,
      reqIp: req.socket.remoteAddress || req.headers["x-forwarded-for"],
      resBody: res.__custombody__,
      resHeaders: res.getHeaders(),
      resStatus: res.statusCode,
      responseTime: (endTime.getTime() - startTime.getTime()) / 1000000,
      token: null,
      error: null,
    };
    // await addRequestLog(logData);
  });

  next();
};
