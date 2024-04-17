/**
 * exception-handler.js
 *  예외처리를 전역으로 처리
 */
const { StatusCodes } = require('http-status-codes');

const response = require('@/common/response');
const config = require('@/config');

const { BizError } = require('@/error');
const DEBUG_MODE = config.nodeEnv !== 'prod';

/**
 *
 * @param {*} err
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
function handleException(err, req, res, next) {
  if (err instanceof BizError) {
    const stackTrace = DEBUG_MODE ? err.stack : {};
    response(res, err.status, err.message, stackTrace);
  } else {
    const stackTrace = DEBUG_MODE ? err.stack : {};
    response(res, err.status, err.message, stackTrace);
  }
}

module.exports = {
  handleException
};
