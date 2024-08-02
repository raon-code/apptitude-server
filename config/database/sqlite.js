/**
 * sqlite.js
 *  로컬용 데이터 베이스
 */
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();

const sqliteConfig = require('@/config').database.sqlite;
const logger = require('@/config/logger');


// // 데이터베이스 파일 삭제
// if (fs.existsSync(sqliteConfig.storagePath)) {
//     fs.unlinkSync(sqliteConfig.storagePath);
// }

// 데이터베이스 객체 생성
const db = new sqlite3.Database(sqliteConfig.storagePath, (err) => {
  if (err) {
    return logger.error(err.message);
  }
  logger.info('새로운 데이터베이스 파일이 성공적으로 생성되었습니다.');
});

// 초기 테이블 생성 및 기본 데이터 삽입
db.serialize(() => {
  /* 
    example)
      db.run('CREATE TABLE IF NOT EXISTS contacts (id INTEGER PRIMARY KEY, name TEXT, email TEXT)');
      db.run('INSERT INTO contacts (name, email) VALUES (?, ?)', ['Alice', 'alice@example.com']);
  */
});

// 앱 종료시 데이터베이스 닫기
process.on('SIGINT', () => {
  db.close((err) => {
    if (err) {
      return logger.error(err.message);
    }
    logger.info('데이터베이스 연결이 닫혔습니다.');
  });
});

module.exports = { db };
