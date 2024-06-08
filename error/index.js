/**
 * error/index.js
 *  에러처리용 클래스 모음
 */
const { StatusCodes } = require('http-status-codes');

// BizError(400) 비즈니스 에러
class BizError extends Error {
  status = StatusCodes.BAD_REQUEST;
  constructor(message = '잘못된 요청입니다.') {
    super(message);
    this.name = `Bad Request`;
  }
}

class UnauthorizeError extends Error {
  status = StatusCodes.UNAUTHORIZED;
  constructor(message = '권한이 없습니다.') {
    super(message);
    this.name = `Unauthorized`;
  }
}

module.exports = {
  BizError,
  UnauthorizeError
};
