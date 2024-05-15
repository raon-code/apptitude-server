/**
 * routes/index.js
 *  라우트 설정 중앙 관리 및 설정
 */
const { API_BASE_PATH } = require('@/config/const');
const { authMiddleware } = require('@/middleware/auth-handler');

function initialize(app) {
  ////////////////// API /////////////////////

  // Auth 설정(모든 /api 로 시작하는 URL에 적용)
  // app.use(`${API_BASE_PATH}/`, authMiddleware);

  /**
   * @swagger
   * tags:
   *  name: Tests
   *  description: 테스트용 API
   */
  app.use(`${API_BASE_PATH}/tests`, require('@/routes/test-controller'));

  /**
   * @swagger
   * tags:
   *  name: Auth
   *  description: 인증 API
   */
  app.use(`${API_BASE_PATH}/auth`, require('@/routes/auth-controller'));
}

module.exports = { initialize };
