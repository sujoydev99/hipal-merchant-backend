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
      items.hasMany(models.portions, {
        foreignKey: "itemId",
        as: "portions",
      });
    }
  }
  items.init(
    {
      uuid: { type: DataTypes.STRING, unique: true },
      businessId: { type: DataTypes.INTEGER, allowNull: false },
      stationId: { type: DataTypes.INTEGER, allowNull: false },
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
      gst: { type: DataTypes.DOUBLE(10, 2), defaultValue: 9 },
      cgst: { type: DataTypes.DOUBLE(10, 2), defaultValue: 9 },
      isActive: { type: DataTypes.BOOLEAN, defaultValue: false },
    },
    {
      sequelize,
      modelName: "items",
      paranoid: true,
    }
  );
  items.beforeCreate((doc, _) => {
    return (doc.uuid = "item_" + nanoid(20));
  });
  return items;
};
