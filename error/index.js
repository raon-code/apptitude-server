/**
 * error/index.js
 *  에러처리용 클래스 모음
 */
const { StatusCodes } = require('http-status-codes');
// BizError(400)
class BizError extends Error {
  status = StatusCodes.BAD_REQUEST;
  constructor(message = '잘못된 요청입니다.') {
    super(message);
    this.name = `Bad Request`;
  }
}

module.exports = {
  BizError
};
