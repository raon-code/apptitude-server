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

// MethodNotAllowed(405)
class MethodNotAllowedError extends Error {
  status = StatusCodes.METHOD_NOT_ALLOWED;
  constructor(message = '등록되지 않은 요청 메소드입니다.') {
    super(message);
    this.name = 'Method not allowed';
  }
}

// // Forbidden(403)
// class ForbiddenError extends Error {
//   constructor(message) {
//     super(message);
//     this.status = StatusCodes.FORBIDDEN;
//   }
// }

// // NotFoundError(404)
// class NotFoundError extends Error {
//   constructor(message) {
//     super(message);
//     this.status = StatusCodes.NOT_FOUND;
//   }
// }

// // InternalServerError(500)
// class InternalServerError extends Error {
//   constructor(message) {
//     super(message);
//     this.status = StatusCodes.INTERNAL_SERVER_ERROR;
//   }
// }

module.exports = {
  BizError,
  MethodNotAllowedError
};
