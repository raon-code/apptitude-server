/**
 * server.js
 *  서버 초기화 및 실행 파일
 */
const express = require('express');
const bodyParser = require('body-parser');

// 프로젝트 루트 경로
const ROOT_DIR = process.cwd();

// Configs
const config = require(ROOT_DIR + '/config');
const db = require(ROOT_DIR + '/config/database');

// API
const sequelize = require(ROOT_DIR + '/models');
const testService = require(ROOT_DIR + '/services/test.service');
const routes = require(ROOT_DIR + '/routes');

const app = express();

// 서버 기본 설정
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

///////////////////////////////////////////////////////////////////////////
/* Sequelize TEST(임시코드) */
async function initialize() {
  try {
    await sequelize.sync();
    console.log('모든 모델이 동기화되었습니다.');

    const testListSize = await testService.getTestSize();
    if (testListSize === 0) {
      console.log('데이터가 비어있으므로 임의생성');
      for (let i = 1; i <= 100; i++) {
        await testService.createTest(`앱티튜트 테스트 제목 ${i}`, `앱티튜트 테스트 내용 ${i}`);
      }
    }
    console.log('서버 초기화 성공');
  } catch (error) {
    console.error('서버 초기화 중 오류 발생:', error);
  }
}
initialize();

/* Sequelize TEST */
///////////////////////////////////////////////////////////////////////////

// Home Page
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Routes settings
routes.initialize(app);

app.listen(config.port, () => {
  console.log(`Server is running`);
});
