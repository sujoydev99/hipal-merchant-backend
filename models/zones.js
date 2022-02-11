"use strict";
const { nanoid } = require("nanoid");
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class zones extends Model {
    static associate(models) {
      // define association here
      zones.belongsTo(models.businesses, {
        foreignKey: "businessId",
        as: "business",
        onDelete: "CASCADE",
      });
      zones.hasMany(models.tables, {
        foreignKey: "zoneId",
        as: "tables",
      });
      zones.hasMany(models.carts, {
        foreignKey: "zoneId",
        as: "carts",
      });
    }
  }
  zones.init(
    {
      uuid: { type: DataTypes.STRING, unique: true },
      businessId: { type: DataTypes.INTEGER, allowNull: false },
      capacity: { type: DataTypes.INTEGER, defaultValue: 0 },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      type: { type: DataTypes.STRING, comment: "DINE-IN/TAKE-AWAY/DELIVERY" },
      notes: DataTypes.STRING,
      isActive: { type: DataTypes.BOOLEAN, defaultValue: false },
    },
    {
      sequelize,
      modelName: "zones",
      paranoid: true,
    }
  );
  zones.beforeCreate((doc, _) => {
    return (doc.uuid = "zone_" + nanoid(20));
  });
  return zones;
};
