"use strict";
const { nanoid } = require("nanoid");
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class categories extends Model {
    static associate(models) {
      // define association here
      categories.belongsTo(models.businesses, {
        foreignKey: "businessId",
        as: "business",
        onDelete: "CASCADE",
      });
      categories.hasMany(categories, {
        foreignKey: "parentCategoryId",
        useJunctionTable: false,
        as: "childCategories",
        onDelete: "SET NULL",
      });
    }
  }
  categories.init(
    {
      uuid: { type: DataTypes.STRING, unique: true },
      businessId: { type: DataTypes.INTEGER, allowNull: false },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      notes: DataTypes.STRING,
      isActive: { type: DataTypes.BOOLEAN, defaultValue: false },
    },
    {
      sequelize,
      modelName: "categories",
      paranoid: true,
    }
  );
  categories.beforeCreate((doc, _) => {
    return (doc.uuid = "category_" + nanoid(20));
  });
  return categories;
};
