"use strict";
const { nanoid } = require("nanoid");
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class cartItems extends Model {
    static associate(models) {
      // define association here
      cartItems.belongsTo(models.businesses, {
        foreignKey: "businessId",
        as: "business",
        onDelete: "CASCADE",
      });
      cartItems.belongsTo(models.portions, {
        foreignKey: "portionId",
        as: "portion",
        onDelete: "CASCADE",
      });
      cartItems.belongsTo(models.items, {
        foreignKey: "itemId",
        as: "item",
        onDelete: "CASCADE",
      });
      cartItems.belongsTo(models.stations, {
        foreignKey: "stationId",
        as: "station",
        onDelete: "CASCADE",
      });
      cartItems.belongsTo(models.tables, {
        foreignKey: "tableId",
        as: "table",
        onDelete: "CASCADE",
      });
      cartItems.belongsTo(models.zones, {
        foreignKey: "zoneId",
        as: "zone",
        onDelete: "CASCADE",
      });
      cartItems.belongsTo(models.carts, {
        foreignKey: "cartId",
        as: "cart",
        onDelete: "CASCADE",
      });
      cartItems.hasMany(models.cartAddons, {
        foreignKey: "cartItemId",
        as: "cartAddons",
      });
    }
  }
  cartItems.init(
    {
      uuid: { type: DataTypes.STRING, unique: true },
      businessId: { type: DataTypes.INTEGER, allowNull: false },
      stationId: { type: DataTypes.INTEGER, allowNull: false },
      cartId: { type: DataTypes.INTEGER, allowNull: false },
      itemId: { type: DataTypes.INTEGER, allowNull: false },
      portionId: { type: DataTypes.INTEGER, allowNull: false },
      quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
      userName: { type: DataTypes.STRING },
      userContactNumber: { type: DataTypes.STRING },
      status: {
        type: DataTypes.STRING,
        defaultValue: "SELECTION",
        comment: "SELECTION/KOT/COOKING/COOKED/SERVED/SETTLED",
      },
      isSettled: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    },
    {
      sequelize,
      modelName: "cartItems",
    }
  );
  cartItems.beforeCreate((doc, _) => {
    return (doc.uuid = "cartItem_" + nanoid(20));
  });
  return cartItems;
};
// TODO implement live cart feature
