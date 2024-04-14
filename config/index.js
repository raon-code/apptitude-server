/**
 * index.js
 * 
 */
const dotenv = require('dotenv');
// .env 파일을 읽고 process.env에 세팅합니다.
dotenv.config();

const DEFAULT_PORT = 3000;

const config = {
  port: process.env.PORT || DEFAULT_PORT,
  // Database
  // Other..
};

module.exports = config;