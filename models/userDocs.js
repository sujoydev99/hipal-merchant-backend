"use strict";
const { nanoid } = require("nanoid");
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class userDocs extends Model {
    static associate(models) {
      // define association here
      userDocs.belongsTo(models.users, {
        foreignKey: "userId",
        as: "user",
        onDelete: "CASCADE",
      });
    }
  }
  userDocs.init(
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
      modelName: "userDocs",
      paranoid: true,
    }
  );
  userDocs.beforeCreate((doc, _) => {
    return (doc.uuid = "userDoc_" + nanoid(20));
  });
  return userDocs;
};