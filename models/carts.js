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
      carts.belongsTo(models.zones, {
        foreignKey: "zoneId",
        as: "zone",
        onDelete: "CASCADE",
      });
      carts.belongsTo(models.tables, {
        foreignKey: "tableId",
        as: "table",
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
      tableId: { type: DataTypes.INTEGER, allowNull: true },
      zoneId: { type: DataTypes.INTEGER, allowNull: false },
      token: { type: DataTypes.INTEGER, defaultValue: 1 },
      type: { type: DataTypes.STRING, allowNull: false, comment: "DINE-IN/DELIVERY/TAKE-AWAY" },
    },
    {
      sequelize,
      modelName: "carts",
    }
  );
  carts.beforeCreate((doc, _) => {
    return (doc.uuid = "cart_" + nanoid(20));
  });
  return carts;
};
