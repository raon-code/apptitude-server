/**
 * error/index.js
 *  에러처리용 클래스 모음
 */
const { StatusCodes } = require('http-status-codes');

// 애플리케이션에서 정의한 에러의 공통 부모
class AppError extends Error {
  constructor(message, status, name) {
    super(message);
    this.status = status;
    this.name = name;
  }
}

// BizError(400) 비즈니스 에러
class BizError extends AppError {
  constructor(message = '잘못된 요청입니다.') {
    super(message, StatusCodes.BAD_REQUEST, 'Bad Request');
  }
}

// UnauthorizeError(401) 권한 에러
class UnauthorizeError extends AppError {
  constructor(message = '권한이 없습니다.') {
    super(message, StatusCodes.UNAUTHORIZED, 'Unauthorized');
  }
}

// NotFoundError(404) 찾을 수 없음 에러
class NotFoundError extends AppError {
  constructor(message = '해당 데이터를 찾을 수 없습니다.') {
    super(message, StatusCodes.NOT_FOUND, 'Not Found');
  }
}

// ConflictError(409) 충돌 에러
class ConflictError extends AppError {
  constructor(message = '이미 존재하는 데이터입니다.') {
    super(message, StatusCodes.CONFLICT, 'Conflict');
  }
}

module.exports = {
  AppError,
  BizError,
  UnauthorizeError,
  NotFoundError,
  ConflictError
};
