/**
 * routes/index.js
 *  라우트 설정 중앙 관리 및 설정
 */
const { API_BASE_PATH } = require('@/config/const');

function initialize(app) {
  // API Base path
  app.use(API_BASE_PATH + '/test', require('@/routes/test-controller'));
}

module.exports = { initialize };
