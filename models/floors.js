"use strict";
const { nanoid } = require("nanoid");
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class floors extends Model {
    static associate(models) {
      // define association here
      floors.belongsTo(models.businesses, {
        foreignKey: "businessId",
        as: "business",
        onDelete: "CASCADE",
      });
      floors.hasMany(models.tables, {
        foreignKey: "floorId",
        as: "tables",
      });
      floors.hasMany(models.stations, {
        foreignKey: "floorId",
        as: "stations",
      });
    }
  }
  floors.init(
    {
      uuid: { type: DataTypes.STRING, unique: true },
      businessId: { type: DataTypes.INTEGER, allowNull: false },
      floorId: { type: DataTypes.INTEGER, allowNull: false },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      notes: DataTypes.STRING,
      isActive: { type: DataTypes.BOOLEAN, defaultValue: false },
    },
    {
      sequelize,
      modelName: "floors",
      paranoid: true,
    }
  );
  floors.beforeCreate((doc, _) => {
    return (doc.uuid = "floor_" + nanoid(20));
  });
  return floors;
};
