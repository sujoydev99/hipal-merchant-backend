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
      addons.belongsTo(models.items, {
        foreignKey: "itemId",
        as: "item",
        onDelete: "CASCADE",
      });
    }
  }
  addons.init(
    {
      uuid: { type: DataTypes.STRING, unique: true },
      businessId: { type: DataTypes.INTEGER, allowNull: false },
      itemId: { type: DataTypes.INTEGER, allowNull: false },
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
    },
    {
      sequelize,
      modelName: "addons",
      paranoid: true,
    }
  );
  addons.beforeCreate((doc, _) => {
    return (doc.uuid = "addon_" + nanoid(20));
  });
  return addons;
};
