/**
 * db.js
 *  데이터베이스 관련 설정
 */
const config = require('@/config'); // config/index
const { DEV, PROD } = require('../const');

let db; // db 인스턴스

switch (config.nodeEnv) {
  case DEV: // 개발환경
  case PROD: // 운영환경
    break;
  default: // 로컬환경
    // sqlite 사용
    db = require('./sqlite');
    break;
}

module.exports = db;
