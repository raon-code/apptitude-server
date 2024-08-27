/**
 * cors.js
 *  CORS(Cross Origin Resource Sharing) 체크를 위한 미들웨어 입니다.
 */
const cors = require('cors');

const corsOption = {
  origin: '*' // 허용할 도메인 목록 정의 ['A', 'B', ...]
};

const corsHandler = cors(corsOption);

module.exports = corsHandler;
