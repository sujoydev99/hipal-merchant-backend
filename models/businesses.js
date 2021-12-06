"use strict";
const { nanoid } = require("nanoid");
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class businesses extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      businesses.belongsToMany(models.users, {
        foreignKey: "businessId",
        as: "users",
        through: "businessUsers",
      });
      businesses.hasMany(models.businessDocs, {
        foreignKey: "businessId",
        as: "businessDocs",
      });
      businesses.hasMany(models.floors, {
        foreignKey: "businessId",
        as: "floors",
      });
      businesses.hasMany(models.tables, {
        foreignKey: "businessId",
        as: "tables",
      });
      businesses.hasMany(models.stations, {
        foreignKey: "businessId",
        as: "stations",
      });
      businesses.hasMany(models.roles, {
        foreignKey: "businessId",
        as: "roles",
      });
    }
  }
  businesses.init(
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
      slug: { type: DataTypes.STRING, unique: true },
      addressLineOne: { type: DataTypes.STRING, allowNull: false },
      addressLineTwo: { type: DataTypes.STRING },
      zip: { type: DataTypes.STRING },
      city: { type: DataTypes.STRING },
      state: { type: DataTypes.STRING },
      country: { type: DataTypes.STRING },
      geo: DataTypes.GEOMETRY("POINT", 4326),
      notes: DataTypes.STRING,
      emails: { type: DataTypes.ARRAY(DataTypes.STRING), defaultValue: [] },
      contactNumbers: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        defaultValue: [],
      },
      notes: DataTypes.STRING,
      isActive: { type: DataTypes.BOOLEAN, defaultValue: false },
      isVerified: { type: DataTypes.BOOLEAN, defaultValue: false },
    },
    {
      sequelize,
      modelName: "businesses",
      paranoid: true,
    }
  );
  businesses.beforeCreate((user, _) => {
    return (user.uuid = "business_" + nanoid(20));
  });
  return businesses;
};
