"use strict";
const { nanoid } = require("nanoid");
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class carts extends Model {
    static associate(models) {
      // define association here
      // carts.belongsTo(models.businesses, {
      //   foreignKey: "businessId",
      //   as: "business",
      //   onDelete: "CASCADE",
      // });
      // carts.belongsTo(models.categories, {
      //   foreignKey: "categoryId",
      //   as: "category",
      //   onDelete: "SET NULL",
      // });
      // carts.belongsTo(models.portions, {
      //   foreignKey: "portionId",
      //   as: "portions",
      // });
    }
  }
  carts.init(
    {
      uuid: { type: DataTypes.STRING, unique: true },
      businessId: { type: DataTypes.INTEGER, allowNull: false },
      tableId: { type: DataTypes.INTEGER, allowNull: true },
      categoryId: { type: DataTypes.INTEGER, allowNull: true },
      itemId: { type: DataTypes.INTEGER, allowNull: false },
      portionId: { type: DataTypes.INTEGER, allowNull: false },
      isActive: { type: DataTypes.BOOLEAN, defaultValue: false },
      userName: { type: DataTypes.STRING },
      userContactNumber: { type: DataTypes.STRING },
    },
    {
      sequelize,
      modelName: "carts",
      paranoid: true,
    }
  );
  carts.beforeCreate((doc, _) => {
    return (doc.uuid = "cart_" + nanoid(20));
  });
  return carts;
};
// TODO implement live cart feature
