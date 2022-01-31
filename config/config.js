require("dotenv").config();
module.exports = {
  development: {
    username: process.env.DBUSERNAME,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    providerDatabase: process.env.PROVIDER_DATABASE,
    host: process.env.HOST,
    dialect: process.env.DIALECT,
    port: process.env.PORT,
    freezeTableName: true,
    pool: {
      max: 10,
      min: 0,
      idle: 10000,
    },
    // dialectOptions: {
    //   // ssl: {
    //   //   require: true,
    //   //   rejectUnauthorized: false,
    //   // },
    // },
    // logging: false,
  },
  test: {
    username: process.env.DBUSERNAME,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    providerDatabase: process.env.PROVIDER_DATABASE,
    host: process.env.HOST,
    dialect: process.env.DIALECT,
    port: process.env.PORT,
    freezeTableName: true,
    pool: {
      max: 10,
      min: 0,
      idle: 500,
    },
    logging: false,
  },
  production: {
    username: process.env.DBUSERNAME,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    providerDatabase: process.env.PROVIDER_DATABASE,
    host: process.env.HOST,
    dialect: process.env.DIALECT,
    port: process.env.PORT,
    freezeTableName: true,
    pool: {
      max: 10,
      min: 0,
      idle: 500,
    },
    logging: false,
  },
};
