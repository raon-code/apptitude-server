/**
 * sqlite.js
 *  로컬용 데이터 베이스
 */
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();
const dbPath = './database.sqlite';

// 데이터베이스 파일 삭제
// if (fs.existsSync(dbPath)) {
//     fs.unlinkSync(dbPath);
// }

// 새 데이터베이스 파일 생성
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log('새로운 데이터베이스 파일이 성공적으로 생성되었습니다.');
});

// 초기 테이블 생성 및 기본 데이터 삽입
db.serialize(() => {
  // db.run('CREATE TABLE IF NOT EXISTS contacts (id INTEGER PRIMARY KEY, name TEXT, email TEXT)');
  // db.run('INSERT INTO contacts (name, email) VALUES (?, ?)', ['Alice', 'alice@example.com']);
});

// 앱 종료시 데이터베이스 닫기
process.on('SIGINT', () => {
  db.close((err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log('데이터베이스 연결이 닫혔습니다.');
  });
});

module.exports = db;