const { createLogger, format, transports } = require("winston");

const logger = createLogger({
  level: "debug",
  format: format.combine(
    format.colorize(),
    format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss",
    }),
    format.printf(
      (info) =>
        `${info.timestamp} ${info.level}: ${info.message}` +
        (info.splat !== undefined ? `${info.splat}` : " ")
    )
  ),
  transports: [new transports.Console()],
});

const error = (error, message = "An error occured") => {
  logger.debug(message);
  logger.error(JSON.stringify(error));
};

function printObject(Provider, P_orderId, p_referenceId, status, userId, orderId, itemId) {
  this.Provider = Provider;
  this.P_orderId = P_orderId;
  this.p_referenceId = p_referenceId;
  this.status = status;
  this.userId = userId;
  this.orderId = orderId;
  this.itemId = itemId;
}
function printMigrationObject(
  Provider,
  P_orderId,
  p_referenceId,
  status,
  userId,
  orderId,
  itemId,
  sku,
  dateKey
) {
  this.Provider = Provider;
  this.P_orderId = P_orderId;
  this.p_referenceId = p_referenceId;
  this.status = status;
  this.userId = userId;
  this.orderId = orderId;
  this.itemId = itemId;
  this.sku = sku;
  this.dateKey = dateKey;
}

module.exports = {
  logger: logger,
  errlog: error,
  processorLogs: printObject,
  printMigrationObject: printMigrationObject,
};
