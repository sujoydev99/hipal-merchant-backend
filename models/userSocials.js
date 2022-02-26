"use strict";
const { nanoid } = require("nanoid");
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class userSocials extends Model {
    static associate(models) {
      // define association here
      userSocials.belongsTo(models.users, {
        foreignKey: "userId",
        as: "user",
        onDelete: "CASCADE",
      });
    }
  }
  userSocials.init(
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
      modelName: "userSocials",
      paranoid: false,
    }
  );
  userSocials.beforeCreate((social, _) => {
    return (social.uuid = "userSocial_" + nanoid(20));
  });
  return userSocials;
};
