"use strict";
const { nanoid } = require("nanoid");
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class businessDocs extends Model {
    static associate(models) {
      // define association here
      businessDocs.belongsTo(models.businesses, {
        foreignKey: "businessId",
        as: "business",
        onDelete: "CASCADE",
      });
    }
  }
  businessDocs.init(
    {
      uuid: { type: DataTypes.STRING, unique: true },
      businessId: { type: DataTypes.INTEGER, allowNull: false },
      type: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: "FSSAI/GST",
      },
      path: { type: DataTypes.STRING(500), allowNull: false },
      notes: { type: DataTypes.STRING },
      referenceNumber: { type: DataTypes.STRING },
      expiration: { type: DataTypes.DATE },
      isActive: { type: DataTypes.BOOLEAN, defaultValue: false },
    },
    {
      sequelize,
      modelName: "businessDocs",
      paranoid: true,
    }
  );
  businessDocs.beforeCreate((doc, _) => {
    return (doc.uuid = "businessDoc_" + nanoid(20));
  });
  return businessDocs;
};
