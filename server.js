/**
 * server.js
 *  서버 초기화 및 실행 파일
 */
// 경로 전역설정 적용
require('module-alias/register');

// Server Main
const express = require('express');
require('express-async-errors'); // 에러 발생시 다음 미들웨어로 넘겨주는 패키지
const bodyParser = require('body-parser');

// Common
const crypto = require('@/common/crypto');

// Config
const config = require('@/config');
require('@/config/database');
const logger = require('@/config/logger');

// Middleware
const { handleException } = require('@/middleware/exception-handler');
const { authHandler } = require('@/middleware/auth-handler');
const ddosDefender = require('@/middleware/ddos-defender');
const corsHandler = require('@/middleware/cors-handler');

// MVC
const sequelize = require('@/models');
const routes = require('@/routes');

const testService = require('@/services/test-service');

const server = express();

// 서버 기본 설정
server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());

// 미들웨어 설정
server.use(ddosDefender);
server.use(corsHandler);
server.use(authHandler.initialize());
server.use(handleException);

// Routes 초기화
routes.initialize(server);

// 서버 초기화
async function initialize() {
  // DB 초기화
  await sequelize.sync();
  logger.info('모든 모델이 동기화되었습니다.');
  logger.info('서버 초기화 성공');
}
initialize();

// 테스트용 서버 초기화
async function initializeForTest() {
  /* Sequelize TEST(임시코드) */
  const testListSize = await testService.getTestSize();
  if (testListSize === 0) {
    logger.info('데이터가 비어있으므로 임의생성');
    for (let i = 1; i <= 100; i++) {
      await testService.createTest(
        `앱티튜트 테스트 제목 ${i}`,
        `앱티튜트 테스트 내용 ${i}`
      );
    }
  }
}
initializeForTest();

// Index Page
server.get('/', (req, res) => {
  res.send('Hello World!');
});

server.listen(config.port, () => {
  logger.info(`Server is running`);
});

module.exports = server;
