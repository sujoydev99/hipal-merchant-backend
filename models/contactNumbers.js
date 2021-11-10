"use strict";
const { nanoid } = require("nanoid");
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class contactNumbers extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      contactNumbers.belongsTo(models.users, {
        foreignKey: "userId",
        as: "user",
        onDelete: "CASCADE",
      });
    }
  }
  contactNumbers.init(
    {
      uuid: { type: DataTypes.STRING, unique: true },
      userId: { type: DataTypes.INTEGER, allowNull: false },
      number: { type: DataTypes.STRING, allowNull: false },
      extension: { type: DataTypes.INTEGER, allowNull: false },
      otp: { type: DataTypes.INTEGER },
      isActive: { type: DataTypes.BOOLEAN, defaultValue: false },
    },
    {
      sequelize,
      modelName: "contactNumbers",
      paranoid: true,
    }
  );
  contactNumbers.beforeCreate((cNum, _) => {
    return (cNum.uuid = "contact_" + nanoid(20));
  });
  return contactNumbers;
};
