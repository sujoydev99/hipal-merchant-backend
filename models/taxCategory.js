"use strict";
const { nanoid } = require("nanoid");
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class taxCategory extends Model {
    static associate(models) {
      // define association here
      taxCategory.belongsTo(models.businesses, {
        foreignKey: "businessId",
        as: "business",
        onDelete: "CASCADE",
      });
      taxCategory.hasMany(models.items, {
        foreignKey: "taxCategoryId",
        as: "items",
      });
      taxCategory.hasMany(models.addons, {
        foreignKey: "taxCategoryId",
        as: "addons",
      });
    }
  }
  taxCategory.init(
    {
      uuid: { type: DataTypes.STRING, unique: true },
      businessId: { type: DataTypes.INTEGER, allowNull: false },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      taxData: { type: DataTypes.JSON, allowNull: false, defaultValue: {} },
    },
    {
      sequelize,
      modelName: "taxCategory",
      paranoid: false,
    }
  );
  taxCategory.beforeCreate((doc, _) => {
    return (doc.uuid = "taxCategory_" + nanoid(20));
  });
  return taxCategory;
};
