/**
 * db.js
 *  데이터 베이스 설정
 *  실행환경별로 관리하기 위함 
 */
let db;

switch(process.env.NODE_ENV) {
  case 'dev': // 개발환경
    break; 

  case 'prod': // 운영환경
    break; 
  
  default: // 로컬환경
    db = require('./sqlite');
    break;
}

module.exports = db;