"use strict";
const { nanoid } = require("nanoid");
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class outOrders extends Model {
    static associate(models) {
      // define association here
      outOrders.belongsTo(models.businesses, {
        foreignKey: "businessId",
        as: "business",
        onDelete: "CASCADE",
      });
      outOrders.hasMany(models.cartItems, {
        foreignKey: "outOrderId",
        as: "cartItems",
      });
    }
  }
  outOrders.init(
    {
      uuid: { type: DataTypes.STRING, unique: true },
      businessId: { type: DataTypes.INTEGER, allowNull: false },
      stationId: { type: DataTypes.INTEGER, allowNull: false },
      type: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "TAKE-AWAY",
        comment: "TAKE-AWAY/DELIVERY",
      },
    },
    {
      sequelize,
      modelName: "outOrders",
    }
  );
  outOrders.beforeCreate((doc, _) => {
    return (doc.uuid = "outOrder_" + nanoid(20));
  });
  return outOrders;
};
// TODO implement live cart feature
