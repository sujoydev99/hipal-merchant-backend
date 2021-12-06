"use strict";
const { nanoid } = require("nanoid");
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class businessUserRoles extends Model {
    static associate(models) {
      // define association here
      businessUserRoles.belongsTo(models.businesses, {
        foreignKey: "businessId",
        as: "business",
        onDelete: "CASCADE",
      });
    }
  }
  businessUserRoles.init(
    {
      businessId: { type: DataTypes.INTEGER, allowNull: false },
      roleId: { type: DataTypes.INTEGER, allowNull: false },
      userId: { type: DataTypes.INTEGER, allowNull: false },
    },
    {
      sequelize,
      modelName: "businessUsers",
      paranoid: true,
    }
  );
  return businessUserRoles;
};
