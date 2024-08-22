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

// UnauthorizeError(401) 권한 에러
class UnauthorizeError extends Error {
  status = StatusCodes.UNAUTHORIZED;
  constructor(message = '권한이 없습니다.') {
    super(message);
    this.name = `Unauthorized`;
  }
}

// NotFoundError(404) 찾을 수 없음 에러
class NotFoundError extends Error {
  status = StatusCodes.NOT_FOUND;
  constructor(message = '해당 데이터를 찾을 수 없습니다.') {
    super(message);
    this.name = `Not Found`;
  }
}

// ConflictError(409) 충돌 에러
class ConflictError extends Error {
  status = StatusCodes.CONFLICT;
  constructor(message = '이미 존재하는 데이터입니다.') {
    super(message);
    this.name = `Conflict`;
  }
}

module.exports = {
  BizError,
  UnauthorizeError,
  NotFoundError,
  ConflictError
};
