"use strict";
const { nanoid } = require("nanoid");
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class carts extends Model {
    static associate(models) {
      // define association here
      carts.belongsTo(models.businesses, {
        foreignKey: "businessId",
        as: "business",
        onDelete: "CASCADE",
      });
      carts.hasMany(models.cartItems, {
        foreignKey: "cartId",
        as: "cartItems",
      });
    }
  }
  carts.init(
    {
      uuid: { type: DataTypes.STRING, unique: true },
      businessId: { type: DataTypes.INTEGER, allowNull: false },
      stationId: { type: DataTypes.INTEGER, allowNull: false },
      tableId: { type: DataTypes.INTEGER, allowNull: true },
      token: { type: DataTypes.INTEGER, defaultValue: 1 },
    },
    {
      sequelize,
      modelName: "carts",
    }
  );
  carts.beforeCreate((doc, _) => {
    return (doc.uuid = "cart" + nanoid(20));
  });
  return carts;
};
