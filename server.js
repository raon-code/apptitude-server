/**
 * server.js
 *  서버 초기화 및 실행 파일
 */
// 경로 전역설정 적용
require('module-alias/register');

const express = require('express');
const bodyParser = require('body-parser');

// 프로젝트 루트 경로

// Configs
const config = require('@/config');
const db = require('@/config/database');
const logger = require('@/config/logger');

// API
const sequelize = require('@/models');
const testService = require('@/services/test.service');
const routes = require('@/routes');

const app = express();

// 서버 기본 설정
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

async function initialize() {
  try {
    await sequelize.sync();
    logger.info('모든 모델이 동기화되었습니다.');

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

    logger.info('서버 초기화 성공');
  } catch (error) {
    logger.error('서버 초기화 중 오류 발생:', error);
  }
}
initialize();

// Routes
routes.initialize(app);

// Home Page
app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(config.port, () => {
  logger.info(`Server is running`);
});
