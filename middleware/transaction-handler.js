const { sequelize } = require('@/models');

const transactionHandler = async function transactionHandler(callback) {
  return async (req, res, next) => {
    try {
      await sequelize.transaction(async (t) => {
        await callback(req, res);
      });
      next();
    } catch (error) {
      next(error);
    }
  };
};

module.exports = transactionHandler;
