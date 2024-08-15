/**
 * server.js
 *  서버 초기화 및 실행 파일
 */

// 경로 전역설정 적용
require('module-alias/register');

// 웹 모듈 관련
const express = require('express');
require('express-async-errors'); // 에러 발생시 다음 미들웨어로 넘겨주는 패키지
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

// 공통 관련
const crypto = require('@/common/crypto');

// 설정 관련
const config = require('@/config');
require('@/config/database');
const logger = require('@/config/logger');

// 미들웨어 관련
const { handleException } = require('@/middleware/exception-handler');
const { authHandler } = require('@/middleware/auth-handler');
const ddosDefender = require('@/middleware/ddos-defender');
const corsHandler = require('@/middleware/cors-handler');

// MVC 관련
const { sequelize } = require('@/models');
const routes = require('@/routes');

const testService = require('@/services/test/test-service');

// Docs 관련
const { swaggerUi, specs } = require('@/config/docs/swagger');

// ENUM 관련
const { ENUM_MAP_LIST, ENUM_CODE_LIST } = require('@/enum');

// 서버 인스턴스 생성
const server = express();

// 서버 기본 설정
server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json()); // Body JSON 파싱 활성화
server.use(cookieParser()); // 쿠키 파싱, 손쉬운 쿠키 데이터 조회를 위함

// 미들웨어 설정(비즈니스 로직 전)
server.use(ddosDefender);
server.use(corsHandler);
server.use(authHandler.initialize());

// Routes 초기화(비즈니스 로직 중)
routes.initialize(server);

// 미들웨어 설정(비즈니스 로직 후)
server.use((err, req, res, next) => handleException(err, req, res, next));

// 서버 초기화
async function initialize() {
  // DB 초기화
  await sequelize.sync();
  logger.info('모든 모델이 동기화되었습니다.');

  // 테스트 초기화
  // await initializeForTest();
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

// 인덱스 페이지 설정
server.get('/', (req, res) => {
  res.redirect('/api-docs');
});

// Swagger 페이지 설정
server.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// 서버 포트 설정
server.listen(config.port, () => {
  logger.info(`Server is running`);
});

module.exports = server;
