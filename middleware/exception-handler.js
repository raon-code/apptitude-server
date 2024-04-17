/**
 * exception-handler.js
 *  예외처리를 전역으로 처리
 */
const response = require('@/common/response');
const { DEBUG_MODE } = require('@/config/const');
const logger = require('@/config/logger');
const { BizError } = require('@/error');

/**
 * 미들웨어를 통해 예외처리를 관리하기 위함
 * 모든 routes 시작점에 포함
 *
 * @param {*} func
 * @returns
 */
function asyncException(func) {
  return function (req, res, next) {
    Promise.resolve(func(req, res, next)).catch(next);
  };
}

/**
 * 에러에 대해 응답 처리
 *
 * @param {*} err
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
function handleException(err, req, res, next) {
  // print stack trace by logger
  logger.error(err.stack);

  const isDefinedError = !checkDefinedError(err);

  // 에러 상태코드
  const errorStatus = isDefinedError ? err.status : 500;

  // 에러 메시지
  const errorMessage = isDefinedError
    ? `${err.name}: ${err.message}`
    : '정의되지 않은 서버에러';

  // 에러 스택
  // 로컬 환경에서만 출력
  const errorDetail = DEBUG_MODE
    ? {
        name: err.name,
        message: err.message,
        stack: cleanStackTrace(err.stack)
      }
    : undefined;

  response(res, errorStatus, errorMessage, errorDetail);
}

/**
 * Plain Text로 변환
 * @param {*} stack
 * @returns
 */
function cleanStackTrace(stack) {
  // ANSI 컬러 코드를 제거하기 위한 정규 표현식
  const ansiEscapeRegex = /\x1b\[[0-9;]*m/g;
  // 컬러 코드 제거
  let cleanStack = stack.replace(ansiEscapeRegex, '');

  // 불필요한 공백 및 줄바꿈 조정을 위해 줄별로 분리 후 다시 결합
  cleanStack = cleanStack
    .split('\n')
    .map((line) => line.trim())
    .join('\n');

  return cleanStack;
}

function checkDefinedError(err) {
  if (err instanceof BizError) return true;
  else return false;
}

module.exports = {
  asyncException,
  handleException
};
