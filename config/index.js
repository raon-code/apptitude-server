/**
 * index.js
 *  실행 환경변수 관리
 */
const dotenv = require('dotenv');

const { ROOT_DIR, SERVER_DEFAULT } = require('./const');

// .env 파일을 읽고 process.env에 세팅합니다.
dotenv.config();

const config = {
  // 노드 실행환경
  nodeEnv: process.env.NODE_ENV || SERVER_DEFAULT.NODE_ENV,
  // 포트
  port: process.env.PORT || SERVER_DEFAULT.PORT,
  // 데이터베이스 관련
  database: {
    // SQLite
    sqlite: {
      storagePath: `${ROOT_DIR}/database.sqlite`
    }
  },
  // DB 인터페이스 설정
  models: {
    forceSync: false
  },
  crypto: {
    algorithm: 'aes-256-cbc',
    seedKey: 'apptitude-crypto-12345'
  },
  jwt: {
    secret: 'SLEPe87w7eEue337ehndn3hHDjjKKDK',
    option: {
      expiresIn: '1h'
    },
    algorithm: ['HS256']
  },
  kakao: {
    restApiKey: '6b42072c0ab619483e4fe33d615880fe',
    redirectUrl: 'https://'
  }
  // Other..
};

module.exports = config;
