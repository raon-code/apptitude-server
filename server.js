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
const Test = require(ROOT_DIR + '/models/test');

const app = express();

// 서버 기본 설정
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));

///////////////////////////////////////////////////////////////////////////
/* Sequelize TEST(임시코드) */
async function initialize() {
  try {
    await sequelize.sync();
    console.log('모든 모델이 동기화되었습니다.');

    const isEmpty = await isTestEmpty();
    if (isEmpty) {
      console.log('데이터가 비어있으므로 임의생성');
      for (let i = 1; i <= 100; i++) {
        await createTest(`앱티튜트 테스트 제목 ${i}`, `앱티튜트 테스트 내용 ${i}`);
      }
    }
    console.log('서버 초기화 성공');
  } catch (error) {
    console.error('서버 초기화 중 오류 발생:', error);
  }
}
initialize();

async function isTestEmpty() {
  try {
    const tests = await Test.findAll();
    return tests.length === 0;
  } catch (error) {
    console.error('에러 발생:', error);
    return false;
  }
}

async function createTest(title, contents) {
  try {
    const newTest = await Test.create({
      dateTime: new Date(),
      title: title,
      contents: contents
    });
    console.log('새로운 데이터가 성공적으로 추가되었습니다:', newTest.toJSON());
  } catch (error) {
    console.error('데이터 추가 중 오류 발생:', error);
  }
}

app.get('/test', async (req, res) => {
  try {
    const testList = await Test.findAll();
    // Sequelize 모델 인스턴스 배열을 JSON으로 변환
    const dataList = testList.map((test) => test.toJSON()); // 각 모델 인스턴스를 JSON 객체로 변환
    res.json({
      message: 'success',
      data: dataList
    });
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({
      message: 'error',
      data: error.message
    });
  }
});
/* Sequelize TEST */
///////////////////////////////////////////////////////////////////////////

// Home Page
app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(config.port, () => {
  console.log(`Server is running`);
});
