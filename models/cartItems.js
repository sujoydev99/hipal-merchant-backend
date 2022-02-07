"use strict";
const { nanoid } = require("nanoid");
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class cartItems extends Model {
    static associate(models) {
      // define association here
      // cartItems.belongsTo(models.businesses, {
      //   foreignKey: "businessId",
      //   as: "business",
      //   onDelete: "CASCADE",
      // });
      // cartItems.belongsTo(models.categories, {
      //   foreignKey: "categoryId",
      //   as: "category",
      //   onDelete: "CASCADE",
      // });
      // cartItems.belongsTo(models.portions, {
      //   foreignKey: "portionId",
      //   as: "portion",
      //   onDelete: "CASCADE",
      // });
      // cartItems.belongsTo(models.items, {
      //   foreignKey: "itemId",
      //   as: "item",
      //   onDelete: "CASCADE",
      // });
      // cartItems.belongsTo(models.stations, {
      //   foreignKey: "stationId",
      //   as: "station",
      //   onDelete: "CASCADE",
      // });
    }
  }
  cartItems.init(
    {
      uuid: { type: DataTypes.STRING, unique: true },
      businessId: { type: DataTypes.INTEGER, allowNull: false },
      stationId: { type: DataTypes.INTEGER, allowNull: false },
      tableId: { type: DataTypes.INTEGER, allowNull: true },
      categoryId: { type: DataTypes.INTEGER, allowNull: true },
      itemId: { type: DataTypes.INTEGER, allowNull: false },
      portionId: { type: DataTypes.INTEGER, allowNull: false },
      quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
      userName: { type: DataTypes.STRING },
      userContactNumber: { type: DataTypes.STRING },
    },
    {
      sequelize,
      modelName: "cartItems",
      paranoid: true,
    }
  );
  cartItems.beforeCreate((doc, _) => {
    return (doc.uuid = "cartItem_" + nanoid(20));
  });
  return cartItems;
};
// TODO implement live cart feature
