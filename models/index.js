"use strict";

const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const { logger } = require("../common/functions/logger");
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";
const config = require(__dirname + "/../config/config.js")[env];
const db = {};
const connection = {};

let sequelize;
async function dbConn() {
  if (config.use_env_variable) {
    sequelize = new Sequelize(process.env[config.use_env_variable], config);
  } else {
    sequelize = new Sequelize(config.database, config.username, config.password, config);
    // use existing connnection if it exists
    if (connection.isConnected) {
      logger.info("using existing connection");
      return db;
    }
    await sequelize.authenticate();
    logger.info("creating new connection");
    connection.isConnected = true;
  }

  fs.readdirSync(__dirname)
    .filter((file) => {
      // if (file.indexOf(".") < -1) {
      //   fs.readdirSync(`${__dirname}/${file}`).filter((nested) => {
      //     // return nested.indexOf(".") !== 0 && nested !== basename && nested.slice(-3) === ".js";
      //   });
      //   console.log("nested");
      // }
      // console.log(file, file.indexOf("."));
      return file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js";
    })
    .forEach((file) => {
      const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
      db[model.name] = model;
    });

  Object.keys(db).forEach((modelName) => {
    if (db[modelName].associate) {
      db[modelName].associate(db);
    }
  });

  db.sequelize = sequelize;
  db.Sequelize = Sequelize;

  return db;
}
module.exports = dbConn;
