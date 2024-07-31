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

  // /**
  //  * @swagger
  //  * tags:
  //  *  name: Tests
  //  *  description: 테스트용 API
  //  */
  // app.use(`${API_BASE_PATH}/tests`, require('@/routes/test/test-controller'));

  // /**
  //  * @swagger
  //  * tags:
  //  *  name: Tests
  //  *  description: 테스트용 API
  //  */
  // app.use(
  //   `${API_BASE_PATH}/auth/tests`,
  //   require('@/routes/test/auth-test-controller')
  // );

  /**
   * @swagger
   * tags:
   *  name: Users
   *  description: 사용자 관련 API
   */
  app.use(`${API_BASE_PATH}/users`, require('@/routes/user-controller'));

  /**
   * @swagger
   * tags:
   *  name: Sessions
   *  description: 사용자 세션 관련 API
   */
  app.use(`${API_BASE_PATH}/sessions`, require('@/routes/session-controller'));
}

module.exports = { initialize };
