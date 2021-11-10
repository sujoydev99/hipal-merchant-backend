"use strict";
const { nanoid } = require("nanoid");
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class docs extends Model {
    static associate(models) {
      // define association here
      docs.belongsTo(models.users, {
        foreignKey: "userId",
        as: "user",
        onDelete: "CASCADE",
      });
    }
  }
  docs.init(
    {
      uuid: { type: DataTypes.STRING, unique: true },
      userId: { type: DataTypes.INTEGER, allowNull: false },
      type: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: "AADHARCARD/PANCARD/PASSPORT",
      },
      notes: { type: DataTypes.STRING },
      referenceNumber: { type: DataTypes.STRING },
      expiration: { type: DataTypes.DATE },
      isActive: { type: DataTypes.BOOLEAN, defaultValue: false },
    },
    {
      sequelize,
      modelName: "docs",
      paranoid: true,
    }
  );
  docs.beforeCreate((doc, _) => {
    return (doc.uuid = "doc_" + nanoid(20));
  });
  return docs;
};
