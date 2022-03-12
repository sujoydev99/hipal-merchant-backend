const { DEFAULT_EXCLUDE } = require("../common/constants/attributes");
const dbConn = require("../models");

exports.createOrder = (transaction, orderObj) => {
  return new Promise(async (resolve, reject) => {
    const { orders } = await dbConn();
    try {
      const order = await orders.create(orderObj, { transaction });
      resolve(order);
    } catch (error) {
      reject(error);
    }
  });
};
exports.createOrderItems = (transaction, orderObj) => {
  return new Promise(async (resolve, reject) => {
    const { orderItems } = await dbConn();
    try {
      const order = await orderItems.bulkCreate(orderObj, { transaction });
      resolve(order);
    } catch (error) {
      reject(error);
    }
  });
};
