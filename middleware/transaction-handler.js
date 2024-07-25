const { sequelize } = require('@/models');

async function transactionHandler(req, res, callback) {
  try {
    await sequelize.transaction(async (t) => {
      await callback(req, res);
    });
  } catch (error) {
    logger.error(error);
    throw error;
  }
}

module.exports = transactionHandler;
