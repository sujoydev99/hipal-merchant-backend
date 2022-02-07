"use strict";
const { nanoid } = require("nanoid");
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class orderItems extends Model {
    static associate(models) {
      // orderItems.belongsTo(models.businesses, {
      //   foreignKey: "businessId",
      //   as: "business",
      //   onDelete: "CASCADE",
      // });
      // orderItems.belongsTo(models.orders, {
      //   foreignKey: "orderId",
      //   as: "order",
      //   onDelete: "CASCADE",
      // });
    }
  }
  orderItems.init(
    {
      uuid: { type: DataTypes.STRING, unique: true },
      businessId: { type: DataTypes.INTEGER, allowNull: false },
      orderId: { type: DataTypes.INTEGER, allowNull: false },
      name: { type: DataTypes.STRING },
      quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
      addons: { type: DataTypes.JSON(DataTypes.JSON), defaultValue: [] }, // [{name:"xyz", quantity:1}]
      totalAmount: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
      sgst: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 }, //amt
      cgst: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 }, //amt
      discountAmount: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
      paidAmount: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    },
    {
      sequelize,
      modelName: "orderItems",
      paranoid: true,
    }
  );
  orderItems.beforeCreate((doc, _) => {
    return (doc.uuid = "orderItem_" + nanoid(20));
  });
  return orderItems;
};
