exports.publishToQueue = async (channel, queueName, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const result = await channel.assertQueue(queueName, {
        durable: true,
      });
      let k = await channel.sendToQueue(queueName, Buffer.from(JSON.stringify(data)), {
        persistent: true,
      });
      resolve();
    } catch (error) {
      reject(error);
    }
  });
};
