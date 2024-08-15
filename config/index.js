/**
 * index.js
 *  실행 환경변수 관리
 *
 *  실행환경에 영향을 받지 않는 공통적으로 사용되는 환경설정 값 관리
 */
const dotenv = require('dotenv');

const { ROOT_DIR, SERVER_DEFAULT } = require('./const');

// .env 파일을 읽고 process.env에 세팅
dotenv.config();

const config = {
  // 실행환경
  nodeEnv: process.env.NODE_ENV || SERVER_DEFAULT.NODE_ENV,
  // 포트
  port: process.env.PORT || SERVER_DEFAULT.PORT,
  // 데이터베이스 설정
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
  // 암호 설정
  crypto: {
    algorithm: 'aes-256-cbc',
    seedKey: 'apptitude-crypto-12345'
  },
  // jwt 토큰 설정
  jwt: {
    secret: 'SLEPe87w7eEue337ehndn3hHDjjKKDK',
    option: {
      access: { expiresIn: '1h' },
      refresh: { expiresIn: '7d' }
    },
    algorithm: ['HS256'],
    cookie: {
      name: 'accessToken',
      option: {
        httpOnly: true,
        secure: true,
        sameSite: 'none'
      }
    }
  },
  // 카카오 API 설정
  kakao: {
    restApiKey: '6b42072c0ab619483e4fe33d615880fe',
    redirectUrl: 'http://localhost:3000/auth/kakao/user/test'
  }

  // Others..
};

module.exports = config;
