"use strict";
const { nanoid } = require("nanoid");
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class stations extends Model {
    static associate(models) {
      // define association here
      stations.belongsTo(models.businesses, {
        foreignKey: "businessId",
        as: "business",
        onDelete: "CASCADE",
      });
      stations.hasMany(models.items, {
        foreignKey: "stationId",
        as: "item",
      });
      stations.hasMany(models.cartItems, {
        foreignKey: "stationId",
        as: "cartItems",
      });
    }
  }
  stations.init(
    {
      uuid: { type: DataTypes.STRING, unique: true },
      businessId: { type: DataTypes.INTEGER, allowNull: false },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      type: { type: DataTypes.STRING, comment: "KITCHEN/BAR" },
      notes: DataTypes.STRING,
      isActive: { type: DataTypes.BOOLEAN, defaultValue: false },
    },
    {
      sequelize,
      modelName: "stations",
      paranoid: true,
    }
  );
  stations.beforeCreate((doc, _) => {
    return (doc.uuid = "station_" + nanoid(20));
  });
  return stations;
};
