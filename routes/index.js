/**
 * routes/index.js
 *  라우트 설정 중앙 관리 및 설정
 */
const { API_BASE_PATH } = require('@/config/const');

function initialize(app) {
  test(app);

  ////////////////// API /////////////////////
  
  app.use(`${API_BASE_PATH}/users`, require('@/routes/user-controller'));

  
  app.use(`${API_BASE_PATH}/friends`, require('@/routes/friend-controller'));

  
  app.use(`${API_BASE_PATH}/devices`, require('@/routes/device-controller'));

  
  app.use(`${API_BASE_PATH}/battles`, require('@/routes/battle-controller'));

  
  app.use(
    `${API_BASE_PATH}/battles/:battleId(\\d+)/details`,
    require('@/routes/battle-detail-controller')
  );

  
  app.use(
    `${API_BASE_PATH}/battles/:battleId(\\d+)/histories`,
    require('@/routes/battle-history-controller')
  );

  
  app.use(
    `${API_BASE_PATH}/battles/:battleId(\\d+)/invitations`,
    require('@/routes/battle-invitation-controller')
  );

  
  app.use(`${API_BASE_PATH}/sessions`, require('@/routes/session-controller'));

  
  app.use(`${API_BASE_PATH}/auth`, require('@/routes/auth-controller'));
}

function test(app) {
  
  app.use(`${API_BASE_PATH}/tests`, require('@/routes/test/test-controller'));

  
  app.use(
    `${API_BASE_PATH}/auth/tests`,
    require('@/routes/test/auth-test-controller')
  );
}

module.exports = { initialize };
