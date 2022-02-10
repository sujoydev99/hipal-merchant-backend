"use strict";
const { nanoid } = require("nanoid");
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class portions extends Model {
    static associate(models) {
      // define association here
      portions.belongsTo(models.businesses, {
        foreignKey: "businessId",
        as: "business",
        onDelete: "CASCADE",
      });
      portions.belongsTo(models.items, {
        foreignKey: "itemId",
        onDelete: "CASCADE",
      });
      portions.hasMany(models.cartItems, {
        foreignKey: "portionId",
        as: "cartItems",
      });
    }
  }
  portions.init(
    {
      uuid: { type: DataTypes.STRING, unique: true },
      businessId: { type: DataTypes.INTEGER, allowNull: false },
      itemId: { type: DataTypes.INTEGER, allowNull: false },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      notes: DataTypes.STRING,
      price: {
        type: DataTypes.DOUBLE(10, 2),
        allowNull: false,
        defaultValue: 0.0,
      },
    },
    {
      sequelize,
      modelName: "portions",
      paranoid: true,
    }
  );
  portions.beforeCreate((doc, _) => {
    return (doc.uuid = "portion_" + nanoid(20));
  });
  return portions;
};
