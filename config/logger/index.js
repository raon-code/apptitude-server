/**
 * logger.js
 *  로그 기록 설정
 */

const winston = require('winston');

const config = require('@/config');
const { DEV, PROD } = require('../const');

const logger = winston.createLogger(getInitParam());

// 실행환경에 따른 초기 파라미터 설정
function getInitParam() {
  let level, filename;

  switch (config.nodeEnv) {
    // 개발환경
    case DEV:
      level = 'info';
      filename = 'log-dev.log';
      break;
    // 운영환경
    case PROD:
      level = 'warn';
      filename = 'log-prod.log';
      break;
    // 로컬환경
    default:
      level = 'debug';
      filename = 'log-local.log';
      break;
  }

  return {
    level: level,
    format: winston.format.combine(
      winston.format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss'
      }),
      winston.format((info) => {
        // 대문자로 변환
        info.level = info.level.toUpperCase();
        // 공백 칸 수 고정
        info.level = info.level.padEnd(5, ' ');
        // '[LEVEL]'로 변환
        info.level = `[${info.level}]`;
        return info;
      })(),
      // 색깔 출력
      winston.format.colorize({
        all: true
      }),
      // 출력 포맷 설정
      winston.format.printf((info) => {
        return `${info.level} ${info.timestamp}    ${info.message}`;
      })
    ),
    transports: [
      // 파일저장
      new winston.transports.File({ filename: filename }),
      // 콘솔출력
      new winston.transports.Console()
    ]
  };
}

/* 
  example)
    logger.error('This is an error message');
    logger.warn('This is a warning message');
    logger.info('This is an info message');
    logger.debug('This is a debug message');
*/

module.exports = logger;
