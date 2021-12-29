"use strict";
const { nanoid } = require("nanoid");
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class roles extends Model {
    static associate(models) {
      // define association here
      roles.belongsTo(models.businesses, {
        foreignKey: "businessId",
        as: "business",
        onDelete: "CASCADE",
      });
      roles.belongsToMany(models.users, {
        foreignKey: "roleId",
        as: "userRoles",
        through: "businessUsers",
      });
    }
  }
  roles.init(
    {
      uuid: { type: DataTypes.STRING, unique: true },
      businessId: { type: DataTypes.INTEGER, allowNull: false },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      privileges: DataTypes.ARRAY(DataTypes.STRING),
      notes: DataTypes.STRING,
      isActive: { type: DataTypes.BOOLEAN, defaultValue: false },
    },
    {
      sequelize,
      modelName: "roles",
      paranoid: true,
    }
  );
  roles.beforeCreate((doc, _) => {
    return (doc.uuid = "role_" + nanoid(20));
  });
  return roles;
};
