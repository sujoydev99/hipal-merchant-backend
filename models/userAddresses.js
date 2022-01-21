"use strict";
const { nanoid } = require("nanoid");
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class userAddresses extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      userAddresses.belongsTo(models.users, {
        foreignKey: "userId",
        as: "user",
        onDelete: "CASCADE",
      });
    }
  }
  userAddresses.init(
    {
      uuid: { type: DataTypes.STRING, unique: true },
      userId: { type: DataTypes.INTEGER, allowNull: false },
      lineOne: { type: DataTypes.STRING, allowNull: false },
      lineTwo: { type: DataTypes.STRING },
      zip: { type: DataTypes.STRING },
      city: { type: DataTypes.STRING },
      state: { type: DataTypes.STRING },
      country: { type: DataTypes.STRING },
      // geo: DataTypes.GEOMETRY("POINT", 4326),
      isActive: { type: DataTypes.BOOLEAN, defaultValue: false },
    },
    {
      sequelize,
      modelName: "userAddresses",
      paranoid: true,
    }
  );
  userAddresses.beforeCreate((address, _) => {
    return (address.uuid = "userAddress_" + nanoid(20));
  });
  return userAddresses;
};
