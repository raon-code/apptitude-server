/**
 * server.js
 *  서버 초기화 및 실행 파일
 */
// Libs
const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes/index');

// Configs
const config = require('./config');
const db = require('./config/database');

const app = express();

// 서버 기본 설정
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

const PORT = config.port;
app.listen(PORT, () => {
  console.log(`Server is running`);
});