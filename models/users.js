"use strict";
const { nanoid } = require("nanoid");
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      users.hasMany(models.addresses, {
        foreignKey: "userId",
        as: "addresses",
      });
      users.hasMany(models.docs, {
        foreignKey: "userId",
        as: "docs",
      });
      users.hasMany(models.emails, {
        foreignKey: "userId",
        as: "emails",
      });
      users.hasMany(models.contactNumbers, {
        foreignKey: "userId",
        as: "contactNumbers",
      });
    }
  }
  users.init(
    {
      uuid: { type: DataTypes.STRING, unique: true },
      name: { type: DataTypes.STRING },
      password: { type: DataTypes.STRING },
      profileImageUrl: { type: DataTypes.STRING },
      coverImageUrl: { type: DataTypes.STRING },
      resetToken: { type: DataTypes.STRING },
      resetTokenExpiry: { type: DataTypes.DATE },
      isActive: { type: DataTypes.BOOLEAN, defaultValue: false },
      userTypes: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        defaultValue: ["CUSTOMER"],
        comment: "[CUSTOMER, EMPLOYEE, ADMIN]",
      },
    },
    {
      sequelize,
      modelName: "users",
      paranoid: true,
    }
  );
  users.beforeCreate((user, _) => {
    return (user.uuid = "user_" + nanoid(20));
  });
  return users;
};
