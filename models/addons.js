"use strict";
const { nanoid } = require("nanoid");
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class addons extends Model {
    static associate(models) {
      // define association here
      addons.belongsTo(models.businesses, {
        foreignKey: "businessId",
        as: "business",
        onDelete: "CASCADE",
      });
      addons.belongsToMany(models.items, {
        foreignKey: "addonId",
        as: "items",
        through: "itemAddons",
      });
      addons.belongsTo(models.taxCategory, {
        foreignKey: "taxCategoryId",
        as: "taxCategory",
        onDelete: "RESTRICT",
      });
    }
  }
  addons.init(
    {
      uuid: { type: DataTypes.STRING, unique: true },
      businessId: { type: DataTypes.INTEGER, allowNull: false },
      taxCategoryId: { type: DataTypes.INTEGER, allowNull: false },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      price: {
        type: DataTypes.DOUBLE(10, 2),
        allowNull: false,
        defaultValue: 0.0,
      },
      notes: DataTypes.STRING,
      isActive: { type: DataTypes.BOOLEAN, defaultValue: false },
      // sgst: { type: DataTypes.DOUBLE(10, 2), defaultValue: 9 },
      // cgst: { type: DataTypes.DOUBLE(10, 2), defaultValue: 9 },
    },
    {
      sequelize,
      modelName: "addons",
      paranoid: false,
    }
  );
  addons.beforeCreate((doc, _) => {
    return (doc.uuid = "addon_" + nanoid(20));
  });
  return addons;
};
