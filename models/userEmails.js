"use strict";
const { nanoid } = require("nanoid");
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class userEmails extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      userEmails.belongsTo(models.users, {
        foreignKey: "userId",
        as: "user",
        onDelete: "CASCADE",
      });
    }
  }
  userEmails.init(
    {
      uuid: { type: DataTypes.STRING, unique: true },
      userId: { type: DataTypes.INTEGER, allowNull: false },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        set(value) {
          this.setDataValue("email", value.toLowerCase());
        },
      },
      otp: { type: DataTypes.INTEGER },
      isActive: { type: DataTypes.BOOLEAN, defaultValue: false },
    },
    {
      sequelize,
      modelName: "userEmails",
      paranoid: false,
    }
  );
  userEmails.beforeCreate((email, _) => {
    return (email.uuid = "userEmail_" + nanoid(20));
  });
  return userEmails;
};
