/**
 * cors.js
 *  CORS(Cross Origin Resource Sharing) 체크를 위한 미들웨어 입니다.
 */
const cors = require('cors');

const corsOption = {
  origin: '*' // 허용할 출처 목록
};

const corsHandler = cors(corsOption);

module.exports = corsHandler;
