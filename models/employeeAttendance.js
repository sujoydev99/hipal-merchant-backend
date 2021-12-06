"use strict";
const { nanoid } = require("nanoid");
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class employeeAttendance extends Model {
    static associate(models) {
      // define association here
      employeeAttendance.belongsTo(models.businesses, {
        foreignKey: "businessId",
        as: "business",
        onDelete: "CASCADE",
      });
      employeeAttendance.belongsTo(models.users, {
        foreignKey: "userId",
        as: "user",
        onDelete: "CASCADE",
      });
    }
  }
  employeeAttendance.init(
    {
      uuid: { type: DataTypes.STRING, unique: true },
      businessId: { type: DataTypes.INTEGER, allowNull: false },
      userId: { type: DataTypes.INTEGER, allowNull: false },
      inAt: { type: DataTypes.DATE, allowNull: false },
      outAt: { type: DataTypes.DATE, allowNull: true },
    },
    {
      sequelize,
      modelName: "employeeAttendance",
      paranoid: true,
    }
  );
  employeeAttendance.beforeCreate((doc, _) => {
    return (doc.uuid = "employeeAttendance_" + nanoid(20));
  });
  return employeeAttendance;
};
