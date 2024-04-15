/**
 * db.js
 *  데이터베이스 관련 설정
 */
const ROOT_DIR = process.cwd();
const config = require(ROOT_DIR + '/config'); // config/index

let db; // db 인스턴스

switch (config.nodeEnv) {
  case 'dev': // 개발환경
    break;

  case 'prod': // 운영환경
    break;

  default: // 로컬환경
    db = require('./sqlite');
    break;
}

module.exports = db;
