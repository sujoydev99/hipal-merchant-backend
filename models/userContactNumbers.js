"use strict";
const { nanoid } = require("nanoid");
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class userContactNumbers extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      userContactNumbers.belongsTo(models.users, {
        foreignKey: "userId",
        as: "user",
        onDelete: "CASCADE",
      });
    }
  }
  userContactNumbers.init(
    {
      uuid: { type: DataTypes.STRING, unique: true },
      userId: { type: DataTypes.INTEGER, allowNull: false },
      number: { type: DataTypes.STRING, allowNull: false },
      extension: { type: DataTypes.STRING, allowNull: false },
      otp: { type: DataTypes.INTEGER },
      isActive: { type: DataTypes.BOOLEAN, defaultValue: false },
    },
    {
      sequelize,
      modelName: "userContactNumbers",
      paranoid: false,
    }
  );
  userContactNumbers.beforeCreate((cNum, _) => {
    return (cNum.uuid = "userContact_" + nanoid(20));
  });
  return userContactNumbers;
};
