const amqp = require("amqplib");
const { logger } = require("../functions/logger");
const CONNECTION_URL = process.env.RABBITMQ_CONNECTION_URI;

// Publisher and  consumer will decide when to create and close connection using this module
exports.createChannel = async () => {
  try {
    logger.info("connecting to rabbit mq server");
    let connection = await amqp.connect(CONNECTION_URL);
    let channel = await connection.createChannel();
    return channel;
  } catch (error) {
    throw error;
  }
};
