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
      businessUserRoles.belongsTo(models.users, {
        foreignKey: "userId",
        as: "user",
        onDelete: "CASCADE",
      });
      businessUserRoles.belongsTo(models.roles, {
        foreignKey: "roleId",
        as: "role",
        onDelete: "CASCADE",
      });
    }
  }
  businessUserRoles.init(
    {
      businessId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      roleId: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true },
      userId: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true },
    },
    {
      sequelize,
      modelName: "businessUserRoles",
      paranoid: true,
    }
  );
  return businessUserRoles;
};
