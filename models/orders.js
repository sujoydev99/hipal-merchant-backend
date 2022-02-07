"use strict";
const { nanoid } = require("nanoid");
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class orders extends Model {
    static associate(models) {
      // orders.belongsTo(models.businesses, {
      //   foreignKey: "businessId",
      //   as: "business",
      //   onDelete: "CASCADE",
      // });
    }
  }
  orders.init(
    {
      uuid: { type: DataTypes.STRING, unique: true },
      businessId: { type: DataTypes.INTEGER, allowNull: false },
      totalAmount: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
      sgst: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 }, //amt
      cgst: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 }, //amt
      discountAmount: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
      paidAmount: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
      userName: { type: DataTypes.STRING },
      userContactNumber: { type: DataTypes.STRING },
      paymentModes: { type: DataTypes.JSON },
    },
    {
      sequelize,
      modelName: "orders",
      paranoid: true,
    }
  );
  orders.beforeCreate((doc, _) => {
    return (doc.uuid = "order_" + nanoid(20));
  });
  return orders;
};
