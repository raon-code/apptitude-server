const { sequelize } = require('@/models');

const transaction = (callback) => {
  return async (req, res) => await transactionHandler(req, res, callback);
};

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

module.exports = transaction;
