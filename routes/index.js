/**
 * routes/index.js
 *  라우트 설정 중앙 관리 및 설정
 */

function initialize(app) {
  app.use('/test', require('@/routes/test-controller'));
}

module.exports = { initialize };
