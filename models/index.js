/**
 * models/index.js
 *    Sequelize ORM
 *    데이터베이스 스키마 설정 메인
 */
const { Sequelize } = require('sequelize');

const config = require('@/config');
const logger = require('@/config/logger');

// 데이터베이스 연결 인스턴스 생성
const sequelize = new Sequelize(getInitParam());

// 환경에 따른 초기 파라미터 설정
function getInitParam() {
  switch (config.nodeEnv) {
    case 'dev': // 개발환경
      return {
        dialect: 'mysql',
        logging: (query, time) => {
          logger.debug('[' + time + 'ms] ' + query);
        },
        benchmark: true
      };
    case 'prod': // 운영환경
      return {
        dialect: 'mysql',
        logging: false,
        benchmark: false
      };
    default: // 로컬환경
      return {
        dialect: 'sqlite',
        storage: config.database.sqlite.storagePath,
        logging: (query, time) => {
          logger.debug('[' + time + 'ms] ' + query);
        },
        benchmark: true
      };
  }
}

// 데이터베이스 연결 검증
async function authenticate() {
  try {
    await sequelize.authenticate();
    logger.info('[Sequelize] 데이터베이스 연결 성공');
  } catch (error) {
    logger.error('[Sequelize] 데이터베이스에 연결할 수 없음:', error);
  }
}
authenticate();

// SIGINT 신호 감지후 처리
process.on('SIGINT', () => {
  sequelize
    .close()
    .then(() => {
      logger.info('Sequelize 연결 닫힘');
      process.exit(0); // 프로세스 종료
    })
    .catch((err) => {
      logger.error('Sequelize 연결 닫기 실패:', err.message);
      process.exit(1); // 에러를 반환하며 프로세스 종료
    });
});

module.exports = sequelize;
