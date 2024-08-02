/**
 * transaction-handler.js
 *   트랜잭션을 처리하는 미들웨어
 */
const { sequelize } = require('@/models');

/**
 * 컨트롤러 콜백함수를 트랜잭션으로 감싸는 미들웨어
 *
 * @param {Function} callback 컨트롤러 콜백함수
 * @returns {Function} 트랜잭션 미들웨어
 */
const transaction = (callback) => {
  return async (req, res) => await transactionHandler(req, res, callback);
};

/**
 * 트랜잭션 처리
 *
 * @param {Request} req 요청
 * @param {Response} res 응답
 * @param {Function} callback 컨트롤러 콜백함수
 */
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
