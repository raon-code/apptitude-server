/**
 * routes/index.js
 *  라우트 설정 중앙 관리 및 설정
 */
const { API_BASE_PATH } = require('@/config/const');

function initialize(app) {
  test(app);

  ////////////////// API /////////////////////
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
   *  name: Friends
   *  description: 친구 관련 API
   */
  app.use(`${API_BASE_PATH}/friends`, require('@/routes/friend-controller'));

  /**
   * @swagger
   * tags:
   *  name: Devices
   *  description: 기기 관련 API
   */
  app.use(`${API_BASE_PATH}/devices`, require('@/routes/device-controller'));

  /**
   * @swagger
   * tags:
   *  name: Battles
   *  description: 대결 관련 API
   */
  app.use(`${API_BASE_PATH}/battles`, require('@/routes/battle-controller'));

  /**
   * @swagger
   * tags:
   *  name: Battles
   *  description: 대결상세 관련 API
   */
  app.use(
    `${API_BASE_PATH}/battles/:battleId(+d\\)/details`,
    require('@/routes/battle-detail-controller')
  );

  /**
   * @swagger
   * tags:
   *  name: Battles
   *  description: 대결내역 관련 API
   */
  app.use(
    `${API_BASE_PATH}/battles/:battleId(+d\\)/histories`,
    require('@/routes/battle-history-controller')
  );

  /**
   * @swagger
   * tags:
   *  name: Battles
   *  description: 대결초대 관련 API
   */
  app.use(
    `${API_BASE_PATH}/battles/:battleId(+d\\)/invitations`,
    require('@/routes/battle-invitation-controller')
  );

  /**
   * @swagger
   * tags:
   *  name: Sessions
   *  description: 사용자 세션 관련 API
   */
  app.use(`${API_BASE_PATH}/sessions`, require('@/routes/session-controller'));

  /**
   * @swagger
   * tags:
   *  name: Auth
   *  description: 인증 관련 API(로그인, 로그아웃 등)
   */
  app.use(`${API_BASE_PATH}/auth`, require('@/routes/auth-controller'));
}

function test(app) {
  /**
   * @swagger
   * tags:
   *  name: Tests
   *  description: 테스트용 API
   */
  app.use(`${API_BASE_PATH}/tests`, require('@/routes/test/test-controller'));

  /**
   * @swagger
   * tags:
   *  name: Tests
   *  description: 테스트용 API
   */
  app.use(
    `${API_BASE_PATH}/auth/tests`,
    require('@/routes/test/auth-test-controller')
  );
}

module.exports = { initialize };
