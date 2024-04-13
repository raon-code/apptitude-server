/**
 * server.js
 *  서버 초기화 및 실행 파일
 */
const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes/index');

const db = require('./config/database');

const app = express();

// 서버 기본 설정
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running`);
});