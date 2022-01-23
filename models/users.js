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
      users.hasMany(models.userAddresses, {
        foreignKey: "userId",
        as: "userAddresses",
      });
      users.hasMany(models.userDocs, {
        foreignKey: "userId",
        as: "userDocs",
      });
      users.hasMany(models.userEmails, {
        foreignKey: "userId",
        as: "userEmails",
      });
      users.hasMany(models.userContactNumbers, {
        foreignKey: "userId",
        as: "userContactNumbers",
      });
      users.belongsToMany(models.businesses, {
        foreignKey: "userId",
        as: "businesses",
        through: "businessUserRoles",
      });
      users.belongsToMany(models.roles, {
        foreignKey: "userId",
        as: "roles",
        through: "businessUserRoles",
      });
    }
  }
  users.init(
    {
      uuid: { type: DataTypes.STRING, unique: true },
      name: {
        type: DataTypes.STRING,
        set(value) {
          this.setDataValue(
            "name",
            value
              .trim()
              .split(" ")
              .map((i) => i[0].toUpperCase() + i.substring(1).toLowerCase())
              .join(" ")
          );
        },
      },
      password: { type: DataTypes.STRING },
      profileImageUrl: { type: DataTypes.STRING },
      coverImageUrl: { type: DataTypes.STRING },
      resetToken: { type: DataTypes.STRING },
      resetTokenExpiry: { type: DataTypes.DATE },
      accessToken: { type: DataTypes.STRING(1000) },
      isActive: { type: DataTypes.BOOLEAN, defaultValue: false },
      userTypes: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        defaultValue: ["USER"],
        comment: "[CUSTOMER, ADMIN, ACCOUNT_MANAGER, USER]",
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
