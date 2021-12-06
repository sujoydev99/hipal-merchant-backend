"use strict";
const { nanoid } = require("nanoid");
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class tables extends Model {
    static associate(models) {
      // define association here
      tables.belongsTo(models.businesses, {
        foreignKey: "businessId",
        as: "business",
        onDelete: "CASCADE",
      });
      tables.belongsTo(models.floors, {
        foreignKey: "floorId",
        as: "floor",
        onDelete: "CASCADE",
      });
    }
  }
  tables.init(
    {
      uuid: { type: DataTypes.STRING, unique: true },
      businessId: { type: DataTypes.INTEGER, allowNull: false },
      floorId: { type: DataTypes.INTEGER, allowNull: false },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      notes: DataTypes.STRING,
      capacity: { type: DataTypes.INTEGER, defaultValue: 0 },
      isOccupied: { type: DataTypes.BOOLEAN, defaultValue: false },
      status: {
        type: DataTypes.STRING,
        comment: "VACANT/OCCUPIED/CLEANUP",
        defaultValue: "VACANT",
      },
      isActive: { type: DataTypes.BOOLEAN, defaultValue: false },
    },
    {
      sequelize,
      modelName: "tables",
      paranoid: true,
    }
  );
  tables.beforeCreate((doc, _) => {
    return (doc.uuid = "table_" + nanoid(20));
  });
  return tables;
};
