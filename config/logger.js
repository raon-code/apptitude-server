/**
 * logger.js
 *  로그 기록 설정
 */

const winston = require('winston');

const ROOT_DIR = process.cwd();
const config = require(ROOT_DIR + '/config');

const logger = winston.createLogger(getInitParam());

// 환경에 따른 초기 파라미터 설정
function getInitParam() {
  let level, filename;

  switch (config.nodeEnv) {
    case 'dev': // 개발환경
      level = 'info';
      filename = 'log-dev.log';
      break;
    case 'prod': // 운영환경
      level = 'warn';
      filename = 'log-prod.log';
      break;
    default: // 로컬환경
      level = 'debug';
      filename = 'log-local.log';
      break;
  }

  return {
    level: level,
    format: winston.format.json(),
    transports: [
      new winston.transports.File({ filename: filename }),
      new winston.transports.Console({
        format: winston.format.simple()
      })
    ]
  };
}

module.exports = logger;