"use strict";
const { nanoid } = require("nanoid");
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class emails extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      emails.belongsTo(models.users, {
        foreignKey: "userId",
        as: "user",
      });
    }
  }
  emails.init(
    {
      uuid: { type: DataTypes.STRING, unique: true },
      userId: { type: DataTypes.INTEGER, allowNull: false },
      email: { type: DataTypes.STRING, allowNull: false },
      otp: { type: DataTypes.INTEGER },
      isActive: { type: DataTypes.BOOLEAN, defaultValue: false },
    },
    {
      sequelize,
      modelName: "emails",
      paranoid: true,
    }
  );
  emails.beforeCreate((email, _) => {
    return (email.uuid = "email_" + nanoid(20));
  });
  return emails;
};
