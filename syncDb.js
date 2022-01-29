const { logger } = require("./common/functions/logger");
const dbConn = require("./models");
// Sync database with models
async function run() {
  let db = await dbConn();
  let transaction = await db.sequelize.transaction();
  try {
    logger.info(process.env.ENVIRONMENT);
    logger.info(process.env.DBUSERNAME);
    logger.info(process.env.PASSWORD);
    logger.info(process.env.HOST);
    logger.info(process.env.PORT);
    logger.info(process.env.DATABASE);
    await db.sequelize.sync({ alter: true, transaction });
    transaction.commit();
  } catch (error) {
    console.log(error);
    transaction.rollback();
  }
}
run();
