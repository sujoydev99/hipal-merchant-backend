"use strict";
const { nanoid } = require("nanoid");
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class timings extends Model {
    static associate(models) {
      // define association here
      timings.belongsTo(models.businesses, {
        foreignKey: "businessId",
        as: "business",
        onDelete: "CASCADE",
      });
    }
  }
  timings.init(
    {
      uuid: { type: DataTypes.STRING, unique: true },
      businessId: { type: DataTypes.INTEGER, allowNull: false },
      day: {
        type: DataTypes.INTEGER,
        comment:
          "MONDAY:1/TUESDAY:2/WEDNESDAY:3/THUESDAY:4/FRIDAY:5/SATURDAY:6/SUNDAY:7",
      },
      opensAt: { type: DataTypes.TIME, allowNull: false },
      closesAt: { type: DataTypes.TIME, allowNull: false },
    },
    {
      sequelize,
      modelName: "timings",
      paranoid: true,
    }
  );
  timings.beforeCreate((doc, _) => {
    return (doc.uuid = "timing_" + nanoid(20));
  });
  return timings;
};
