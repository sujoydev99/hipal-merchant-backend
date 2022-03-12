"use strict";
const { nanoid } = require("nanoid");
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class orders extends Model {
    static associate(models) {
      orders.belongsTo(models.businesses, {
        foreignKey: "businessId",
        as: "business",
        onDelete: "CASCADE",
      });
    }
  }
  orders.init(
    {
      uuid: { type: DataTypes.STRING, unique: true },
      businessId: { type: DataTypes.INTEGER, allowNull: false },
      totalAmount: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
      discountAmount: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
      paidAmount: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
      userName: { type: DataTypes.STRING },
      userContactNumber: { type: DataTypes.STRING },
      paymentData: { type: DataTypes.JSON },
      taxAmount:{type:DataTypes.JSON},
      currency:{ type: DataTypes.STRING },
    },
    {
      sequelize,
      modelName: "orders",
      paranoid: false,
    }
  );
  orders.beforeCreate((doc, _) => {
    return (doc.uuid = "order_" + nanoid(20));
  });
  return orders;
};
