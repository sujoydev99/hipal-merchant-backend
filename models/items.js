"use strict";
const { nanoid } = require("nanoid");
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class items extends Model {
    static associate(models) {
      // define association here
      items.belongsTo(models.businesses, {
        foreignKey: "businessId",
        as: "business",
        onDelete: "CASCADE",
      });
      items.belongsTo(models.categories, {
        foreignKey: "categoryId",
        as: "category",
        onDelete: "SET NULL",
      });
      items.belongsTo(models.stations, {
        foreignKey: "stationId",
        as: "station",
        onDelete: "RESTRICT",
      });
      items.belongsTo(models.taxCategory, {
        foreignKey: "taxCategoryId",
        as: "taxCategory",
        onDelete: "RESTRICT",
      });
      items.hasMany(models.portions, {
        foreignKey: "itemId",
        as: "portions",
      });
      items.belongsToMany(models.addons, {
        foreignKey: "itemId",
        as: "addons",
        through: "itemAddons",
      });
      items.hasMany(models.cartItems, {
        foreignKey: "itemId",
        as: "cartItems",
      });
    }
  }
  items.init(
    {
      uuid: { type: DataTypes.STRING, unique: true },
      businessId: { type: DataTypes.INTEGER, allowNull: false },
      taxCategoryId: { type: DataTypes.INTEGER, allowNull: false },
      stationId: { type: DataTypes.INTEGER, allowNull: true },
      categoryId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      notes: DataTypes.STRING,
      tags: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false,
        defaultValue: [],
      },
      types: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false,
        defaultValue: [],
      },
      isActive: { type: DataTypes.BOOLEAN, defaultValue: false },
    },
    {
      sequelize,
      modelName: "items",
      paranoid: false,
    }
  );
  items.beforeCreate((doc, _) => {
    return (doc.uuid = "item_" + nanoid(20));
  });
  return items;
};
