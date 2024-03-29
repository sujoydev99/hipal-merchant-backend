"use strict";
const { nanoid } = require("nanoid");
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class cartAddons extends Model {
    static associate(models) {
      cartAddons.belongsTo(models.businesses, {
        foreignKey: "businessId",
        as: "business",
        onDelete: "CASCADE",
      });
      cartAddons.belongsTo(models.cartItems, {
        foreignKey: "cartItemId",
        as: "cartItem",
        onDelete: "CASCADE",
      });
      cartAddons.belongsTo(models.addons, {
        foreignKey: "addonId",
        as: "addon",
        onDelete: "CASCADE",
      });
    }
  }
  cartAddons.init(
    {
      cartItemId: { type: DataTypes.INTEGER, allowNull: false },
      addonId: { type: DataTypes.INTEGER, allowNull: false },
      quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
    },
    {
      sequelize,
      modelName: "cartAddons",
    }
  );

  return cartAddons;
};
// TODO implement live cartAddon feature
