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
        through: "businessUserRoles",
      });
      businesses.hasMany(models.businessDocs, {
        foreignKey: "businessId",
        as: "businessDocs",
      });
      businesses.hasMany(models.zones, {
        foreignKey: "businessId",
        as: "zones",
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
      businesses.hasMany(models.categories, {
        foreignKey: "businessId",
        as: "categories",
      });
      businesses.hasMany(models.items, {
        foreignKey: "businessId",
        as: "items",
      });
      businesses.hasMany(models.portions, {
        foreignKey: "businessId",
        as: "portions",
      });
    }
  }
  businesses.init(
    {
      uuid: { type: DataTypes.STRING, unique: true },
      //basic
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
      timezone: DataTypes.STRING,
      cuisine: { type: DataTypes.ARRAY(DataTypes.STRING), defaultValue: [] },
      notes: DataTypes.STRING,
      slug: { type: DataTypes.STRING, unique: true },
      currency: { type: DataTypes.STRING },
      timings: { type: DataTypes.JSON }, //{MONDAY: {from:1100, to:2200}}
      // address
      addressLineOne: { type: DataTypes.STRING },
      addressLineTwo: { type: DataTypes.STRING },
      zip: { type: DataTypes.STRING },
      city: { type: DataTypes.STRING },
      state: { type: DataTypes.STRING },
      country: { type: DataTypes.STRING },
      // geo: DataTypes.GEOMETRY("POINT", 4326),
      // contacts
      emails: { type: DataTypes.ARRAY(DataTypes.STRING), defaultValue: [] },
      contactNumbers: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        defaultValue: [],
      },
      //image
      profileImageUrl: DataTypes.STRING,
      //bank
      bankName: DataTypes.STRING,
      bankIfscCode: DataTypes.STRING,
      bankAccountNumber: DataTypes.STRING,
      isActive: { type: DataTypes.BOOLEAN, defaultValue: false },
      isVerified: { type: DataTypes.BOOLEAN, defaultValue: false },
    },
    {
      sequelize,
      modelName: "businesses",
      paranoid: true,
    }
  );
  businesses.beforeCreate((business, _) => {
    return (business.uuid = "business_" + nanoid(20));
  });
  return businesses;
};
