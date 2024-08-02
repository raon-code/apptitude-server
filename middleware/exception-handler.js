/**
 * exception-handler.js
 *  예외를 전역으로 캐치하여 처리하는 미들웨어
 */
const response = require('@/common/response');
const { DEBUG_MODE } = require('@/config/const');
const logger = require('@/config/logger');
const { BizError, UnauthorizeError } = require('@/error');

/**
 * 에러에 대한 응답 처리
 *
 * @param {Error} err 에러
 * @param {Request} req 요청
 * @param {Response} res 응답
 * @param {NextFunction} next next 미들웨어 함수
 */
function handleException(err, req, res, next) {
  // 에러스택 로깅
  logger.error(err.stack);

  const isDefinedError = checkDefinedError(err);

  // 정의되지 않은 에러는 500 에러로 처리
  const errorStatus = isDefinedError ? err.status : 500;

  // 에러 메시지
  const errorMessage = isDefinedError
    ? `${err.name}: ${err.message}`
    : '정의되지 않은 서버에러';

  // 에러 스택, 디버그 모드일 경우에만 전달
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
 * Error 스택 Json 형식에 알맞게 변환
 *    1. 색깔 제거
 *    2. 공백 제거
 *    3. 개행 처리
 *
 * @param {string} stack 에러스택 정보
 * @returns {string} json 형식의 에러스택
 */
function cleanStackTrace(stack) {
  // ANSI 컬러 코드를 제거하기 위한 정규 표현식
  const ansiEscapeRegex = /\x1b\[[0-9;]*m/g;
  // 컬러 코드 제거
  let cleanedStack = stack.replace(ansiEscapeRegex, '');

  // 불필요한 공백 및 줄바꿈 조정을 위해 줄별로 분리 후 다시 결합
  cleanedStack = cleanStack
    .split('\n')
    .map((line) => line.trim())
    .join('\n');

  return cleanedStack;
}

/**
 * error/index.js에 정의된 에러인지 검사
 *
 * @param {Error} err 에러객체
 * @returns 정의된 에러이면 true, 아니면 false
 */
function checkDefinedError(err) {
  if (err instanceof BizError) return true;
  else if (err instanceof UnauthorizeError) return true;

  return false;
}

module.exports = {
  handleException
};
