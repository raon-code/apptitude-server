/**
 * models/index.js
 *    Sequelize ORM
 *    데이터베이스 스키마 설정 메인
 */
const { Sequelize } = require('sequelize');

const ROOT_DIR = process.cwd();
const config = require(ROOT_DIR + '/config');

// 데이터베이스 연결 인스턴스 생성
const sequelize = new Sequelize(getInitParam());

// 환경에 따른 초기 파라미터 설정
function getInitParam() {
  switch (config.nodeEnv) {
    case 'dev': // 개발환경
      return {};
    case 'prod': // 운영환경
      return {};
    default: // 로컬환경
      return {
        dialect: 'sqlite',
        storage: config.database.sqlite.storagePath
      };
  }
}

// sequelize 초기화
authenticate();

// 데이터베이스 연결 검증
async function authenticate() {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

// SIGINT 신호 감지후 처리
process.on('SIGINT', () => {
  sequelize
    .close()
    .then(() => {
      console.log('Sequelize 연결이 닫혔습니다.');
      process.exit(0); // 프로세스 종료
    })
    .catch((err) => {
      console.error('Sequelize 연결 닫기 실패:', err.message);
      process.exit(1); // 에러를 반환하며 프로세스 종료
    });
});

module.exports = sequelize;