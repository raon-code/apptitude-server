/**
 * models/index.js
 *    Sequelize ORM
 *    데이터베이스 스키마 설정 메인
 */
const { Sequelize, Transaction } = require('sequelize');
const { cls } = require('cls-hooked');

const config = require('@/config');
const isForce = require('@/config').models.forceSync;
const dbUser = require('@/config/database/user.json')[config.nodeEnv];

const logger = require('@/config/logger');

// 트랜잭션 설정
// cls-hooked 네임스페이스 생성
const namespace = cls.createNamespace('transaction-namespace');

// Sequelize에 cls-hooked 네임스페이스 설정
Sequelize.useCLS(namespace);

// 환경에 따른 초기 파라미터 설정
function getInitParam() {
  switch (config.nodeEnv) {
    case 'dev': // 개발환경
      return {
        username: dbUser.username,
        password: dbUser.password,
        database: dbUser.database,
        options: {
          host: dbUser.host,
          dialect: 'mysql',
          logging: (query, time) => {
            logger.debug('[' + time + 'ms] ' + query);
          },
          benchmark: true
        }
      };
    case 'prod': // 운영환경
      return {
        username: dbUser.username,
        password: dbUser.password,
        database: dbUser.database,
        options: {
          host: dbUser.host,
          dialect: 'mysql',
          logging: false,
          benchmark: false
        }
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

// 초기 파라미터 가져오기
const initParams = getInitParam();

// 데이터베이스 연결 인스턴스 생성
const sequelize = new Sequelize(
  initParams.database || null,
  initParams.username || null,
  initParams.password || null,
  initParams.options
);

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

/**
 * 데이터베이스로부터 대상 스키마를 동기화
 *
 * @param {Model} Model 명세 테이블 클래스명
 */
async function syncModel(Model) {
  try {
    await Model.sync({ force: isForce });
    logger.info(`${Model.tableName} 테이블 동기화 성공`);
  } catch (error) {
    logger.error(`${Model.tableName} 테이블 동기화 실패: `, error);
  }
}

module.exports = { sequelize, syncModel };
