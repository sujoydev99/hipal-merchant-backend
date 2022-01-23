"use strict";
const { nanoid } = require("nanoid");
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class userAttendance extends Model {
    static associate(models) {
      // define association here
      userAttendance.belongsTo(models.businesses, {
        foreignKey: "businessId",
        as: "business",
        onDelete: "CASCADE",
      });
      userAttendance.belongsTo(models.users, {
        foreignKey: "userId",
        as: "user",
        onDelete: "CASCADE",
      });
    }
  }
  userAttendance.init(
    {
      uuid: { type: DataTypes.STRING, unique: true },
      businessId: { type: DataTypes.INTEGER, allowNull: false },
      userId: { type: DataTypes.INTEGER, allowNull: false },
      inAt: { type: DataTypes.DATE, allowNull: false },
      outAt: { type: DataTypes.DATE, allowNull: true },
    },
    {
      sequelize,
      modelName: "userAttendance",
      paranoid: true,
    }
  );
  userAttendance.beforeCreate((doc, _) => {
    return (doc.uuid = "userAttendance_" + nanoid(20));
  });
  return userAttendance;
};
