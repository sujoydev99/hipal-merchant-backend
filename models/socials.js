"use strict";
const { nanoid } = require("nanoid");
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class socials extends Model {
    static associate(models) {
      // define association here
      socials.belongsTo(models.users, {
        foreignKey: "userId",
        as: "user",
        onDelete: "RESTRICT",
      });
    }
  }
  socials.init(
    {
      uuid: { type: DataTypes.STRING, unique: true },
      userId: { type: DataTypes.INTEGER, allowNull: false },
      socialId: { type: DataTypes.STRING, allowNull: false },
      socialId: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: "FACEBOOK/GOOGLE",
      },
      isActive: { type: DataTypes.BOOLEAN, defaultValue: false },
    },
    {
      sequelize,
      modelName: "socials",
      paranoid: true,
    }
  );
  socials.beforeCreate((social, _) => {
    return (social.uuid = "social_" + nanoid(20));
  });
  return socials;
};
