"use strict";
const { nanoid } = require("nanoid");
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class orderItems extends Model {
    static associate(models) {
      orderItems.belongsTo(models.businesses, {
        foreignKey: "businessId",
        as: "business",
        onDelete: "CASCADE",
      });
      orderItems.belongsTo(models.orders, {
        foreignKey: "orderId",
        as: "order",
        onDelete: "CASCADE",
      });
    }
  }
  orderItems.init(
    {
      uuid: { type: DataTypes.STRING, unique: true },
      businessId: { type: DataTypes.INTEGER, allowNull: false },
      orderId: { type: DataTypes.INTEGER, allowNull: false },
      name: { type: DataTypes.STRING },
      quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
      amount: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
      taxData: { type: DataTypes.JSON },
    },
    {
      sequelize,
      modelName: "orderItems",
      paranoid: false,
    }
  );
  orderItems.beforeCreate((doc, _) => {
    return (doc.uuid = "orderItem_" + nanoid(20));
  });
  return orderItems;
};
