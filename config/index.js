/**
 * index.js
 *  실행 환경변수 관리
 */
const dotenv = require('dotenv');

const ROOT_DIR = process.cwd();
const DEFAULT_PORT = 3000;
const DEFAULT_NODE_ENV = 'local';

// .env 파일을 읽고 process.env에 세팅합니다.
dotenv.config();

const config = {
  nodeEnv: process.env.NODE_ENV || DEFAULT_NODE_ENV,
  port: process.env.PORT || DEFAULT_PORT,
  database: {
    sqlite: {
      storagePath: `${ROOT_DIR}/database.sqlite`
    }
  },
  models: {
    forceSync: false
  }
  // Other..
};

module.exports = config;
