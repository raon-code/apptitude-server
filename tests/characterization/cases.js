/**
 * tests/characterization/cases.js
 *
 *  엔드포인트 명세화(characterization) 케이스 목록
 *
 *  - 라우터에 마운트된 모든 핸들러(36개)를 최소 1회 이상 호출한다.
 *  - 각 케이스는 characterization.test.js에서 순서대로 실행된다.
 *    (생성/삭제 등 상태가 누적되므로 배열 순서를 임의로 바꾸면 안 된다)
 *  - 응답의 {status, body}(+ redirect location)는 정규화 후
 *    __fixtures__/responses.json 과 toEqual로 비교된다.
 *
 *  케이스 id 규칙: <module>.<handler>[-변형]
 *  auth: JWT subject(user id). 생략하면 인증 헤더 없이 요청한다.
 *
 *  커버리지 메모
 *  - 모듈별 401(인증 없음) 케이스를 1개 이상 둔다.
 *  - 모듈별 대표 400/404 케이스를 둔다.
 *  - /devices, /friends 단건 조회는 정상 데이터에서 200, 없는 데이터에서 404를 반환한다.
 *  - /battles, /battles/:id/details 생성은 유효한 DTO로 201 응답을 기록한다.
 */
const ACTORS = {
  owner: 1,
  friend: 2,
  stranger: 3
};

const cases = [
  /* ------------------------------ /tests ------------------------------ */
  {
    id: 'tests.create',
    method: 'post',
    path: '/tests',
    body: { title: 'characterization title', contents: 'characterization contents' }
  },
  { id: 'tests.list', method: 'get', path: '/tests' },
  { id: 'tests.get', method: 'get', path: '/tests/201' },
  {
    id: 'tests.get-missing',
    method: 'get',
    path: '/tests/999999',
    note: '없는 id는 빈 객체 + 200 (테스트 서비스 특성)'
  },
  {
    id: 'tests.get-error-path',
    method: 'get',
    path: '/tests/error',
    note: "'/:id' 가 '/error' 보다 먼저 등록되어 에러 엔드포인트가 가려진다"
  },
  {
    id: 'tests.update',
    method: 'patch',
    path: '/tests/201',
    body: { updateParams: { title: 'updated title', contents: 'updated contents' } }
  },
  {
    id: 'tests.update-missing',
    method: 'patch',
    path: '/tests/999999',
    body: { updateParams: { title: 'x' } }
  },
  { id: 'tests.delete', method: 'delete', path: '/tests/202' },
  { id: 'tests.delete-missing', method: 'delete', path: '/tests/202' },

  /* --------------------------- /auth/tests ---------------------------- */
  {
    id: 'auth-tests.protected',
    method: 'get',
    path: '/auth/tests/protected',
    auth: ACTORS.owner
  },
  { id: 'auth-tests.unauthorized', method: 'get', path: '/auth/tests/protected' },

  /* ------------------------------ /users ------------------------------ */
  {
    id: 'users.create',
    method: 'post',
    path: '/users',
    body: {
      email: 'characterization@example.com',
      nickname: 'characterization',
      gender: 'GD0',
      ageRange: 'AR2',
      jobType: 'JT0',
      jobDetail: 'characterization job',
      profilePhotoPath: '/profile/characterization.jpg',
      loginPlatform: { platformType: 'PT0', uuid: 'characterization-uuid' }
    }
  },
  {
    id: 'users.create-invalid',
    method: 'post',
    path: '/users',
    body: {},
    note: 'DTO 검증 실패(400)'
  },
  {
    id: 'users.create-conflict',
    method: 'post',
    path: '/users',
    body: {
      email: 'characterization2@example.com',
      nickname: 'characterization2',
      gender: 'GD0',
      ageRange: 'AR2',
      jobType: 'JT0',
      loginPlatform: { platformType: 'PT0', uuid: 'characterization-uuid' }
    },
    note: '이미 가입된 loginPlatform uuid → 409'
  },
  { id: 'users.get-self', method: 'get', path: '/users/1', auth: ACTORS.owner },
  {
    id: 'users.get-other',
    method: 'get',
    path: '/users/2',
    auth: ACTORS.owner,
    note: '검증 미들웨어가 req.params를 보지 못해 타 사용자 조회가 허용된다'
  },
  { id: 'users.get-missing', method: 'get', path: '/users/99999', auth: 99999 },
  {
    id: 'users.update',
    method: 'patch',
    path: '/users/1',
    auth: ACTORS.owner,
    body: { nickname: 'renamed' }
  },
  { id: 'users.unauthorized', method: 'get', path: '/users/1' },

  /* ----------------------------- /friends ----------------------------- */
  {
    id: 'friends.create',
    method: 'post',
    path: '/friends',
    auth: ACTORS.owner,
    body: { friendId: ACTORS.friend }
  },
  {
    id: 'friends.create-invalid',
    method: 'post',
    path: '/friends',
    auth: ACTORS.owner,
    body: {}
  },
  { id: 'friends.list', method: 'get', path: '/friends', auth: ACTORS.owner },
  { id: 'friends.get', method: 'get', path: '/friends/1', auth: ACTORS.owner },
  { id: 'friends.get-missing', method: 'get', path: '/friends/99999', auth: ACTORS.owner },
  {
    id: 'friends.create-second',
    method: 'post',
    path: '/friends',
    auth: ACTORS.owner,
    body: { friendId: ACTORS.stranger }
  },
  {
    id: 'friends.delete-one',
    method: 'delete',
    path: '/friends/2',
    auth: ACTORS.owner
  },
  {
    id: 'friends.delete-list',
    method: 'delete',
    path: '/friends',
    auth: ACTORS.owner,
    body: { friendPkIdList: [1] }
  },
  { id: 'friends.unauthorized', method: 'get', path: '/friends' },

  /* ----------------------------- /devices ----------------------------- */
  {
    id: 'devices.create',
    method: 'post',
    path: '/devices',
    auth: ACTORS.owner,
    body: { uuid: 'characterization-device', osType: 'OT1', osVersion: '17.0' }
  },
  {
    id: 'devices.create-invalid',
    method: 'post',
    path: '/devices',
    auth: ACTORS.owner,
    body: { uuid: 123, osType: 'NOT_AN_OS' }
  },
  {
    id: 'devices.get',
    method: 'get',
    path: '/devices/1',
    auth: ACTORS.owner,
    note: '서비스에 userId 미전달 → TypeError(500)'
  },
  { id: 'devices.get-missing', method: 'get', path: '/devices/99999', auth: ACTORS.owner },
  { id: 'devices.unauthorized', method: 'get', path: '/devices/1' },

  /* ----------------------------- /battles ----------------------------- */
  {
    id: 'battles.create',
    method: 'post',
    path: '/battles',
    auth: ACTORS.stranger,
    body: {
      name: 'characterization battle',
      startDate: '2024-01-01',
      endDate: '2024-01-31',
      reward: '커피'
    },
    note: 'DTO 인스턴스 필드(isRewardPaid/statusType)가 Joi에서 unknown으로 거부된다'
  },
  {
    id: 'battles.create-invalid',
    method: 'post',
    path: '/battles',
    auth: ACTORS.stranger,
    body: {}
  },
  { id: 'battles.list', method: 'get', path: '/battles', auth: ACTORS.owner },
  { id: 'battles.get', method: 'get', path: '/battles/101', auth: ACTORS.owner },
  { id: 'battles.get-missing', method: 'get', path: '/battles/99999', auth: ACTORS.owner },
  {
    id: 'battles.update',
    method: 'patch',
    path: '/battles/101',
    auth: ACTORS.owner,
    body: { name: 'renamed battle' }
  },
  {
    id: 'battles.update-not-leader',
    method: 'patch',
    path: '/battles/101',
    auth: ACTORS.friend,
    note: '방장이 아닌 사용자는 400으로 거부된다'
  },
  {
    id: 'battles.delete-cancel',
    method: 'delete',
    path: '/battles/101',
    auth: ACTORS.owner,
    query: { isCancel: 'true' }
  },
  { id: 'battles.delete-missing', method: 'delete', path: '/battles/99999', auth: ACTORS.owner },
  { id: 'battles.unauthorized', method: 'get', path: '/battles' },
  {
    id: 'battles.delete-finish',
    method: 'delete',
    path: '/battles/102',
    auth: ACTORS.owner,
    note: 'isCancel 없음 → 종료 처리'
  },

  /* -------------------- /battles/:battleId/details -------------------- */
  {
    id: 'details.create',
    method: 'post',
    path: '/battles/103/details',
    auth: ACTORS.owner,
    body: { detoxTotalTime: 60, detoxTime: 0, resultType: 'RT3' }
  },
  {
    id: 'details.create-invalid',
    method: 'post',
    path: '/battles/102/details',
    auth: ACTORS.owner,
    body: { detoxTotalTime: 60 }
  },
  { id: 'details.list', method: 'get', path: '/battles/102/details', auth: ACTORS.owner },
  {
    id: 'details.list-not-engaged',
    method: 'get',
    path: '/battles/102/details',
    auth: ACTORS.friend,
    note: '참여자가 아닌 사용자는 400으로 거부된다'
  },
  {
    id: 'details.get',
    method: 'get',
    path: '/battles/102/details/102',
    auth: ACTORS.owner
  },
  {
    id: 'details.get-missing',
    method: 'get',
    path: '/battles/102/details/99999',
    auth: ACTORS.owner
  },
  {
    id: 'details.update',
    method: 'patch',
    path: '/battles/102/details/102',
    auth: ACTORS.owner,
    body: { detoxTime: 20 }
  },
  { id: 'details.unauthorized', method: 'get', path: '/battles/102/details' },

  /* ------------------- /battles/:battleId/histories ------------------- */
  {
    id: 'histories.create',
    method: 'post',
    path: '/battles/102/histories',
    auth: ACTORS.owner,
    body: { detoxTime: 10, battleDate: '2024-01-02T00:00:00.000Z' },
    note: '참여자 대결내역 생성 성공(201)'
  },
  {
    id: 'histories.create-invalid',
    method: 'post',
    path: '/battles/102/histories',
    auth: ACTORS.owner,
    body: {}
  },
  { id: 'histories.list', method: 'get', path: '/battles/102/histories', auth: ACTORS.owner },
  {
    id: 'histories.list-missing-battle',
    method: 'get',
    path: '/battles/99999/histories',
    auth: ACTORS.owner
  },
  { id: 'histories.unauthorized', method: 'get', path: '/battles/102/histories' },

  /* ------------------ /battles/:battleId/invitations ------------------ */
  {
    id: 'invitations.create',
    method: 'post',
    path: '/battles/102/invitations',
    auth: ACTORS.owner,
    note: '초대 링크 생성 성공(201)'
  },
  {
    id: 'invitations.create-missing-battle',
    method: 'post',
    path: '/battles/99999/invitations',
    auth: ACTORS.owner
  },
  {
    id: 'invitations.accept',
    method: 'get',
    path: '/battles/102/invitations/invite-token',
    auth: ACTORS.friend
  },
  { id: 'invitations.unauthorized', method: 'get', path: '/battles/102/invitations/invite-token' },

  /* ----------------------------- /sessions ---------------------------- */
  {
    id: 'sessions.create',
    method: 'post',
    path: '/sessions',
    body: { platformType: 'PT0', uuid: 'seeded-login-uuid' }
  },
  {
    id: 'sessions.create-unknown-user',
    method: 'post',
    path: '/sessions',
    body: { platformType: 'PT0', uuid: 'unknown-uuid' }
  },
  { id: 'sessions.create-invalid', method: 'post', path: '/sessions', body: {} },
  { id: 'sessions.delete', method: 'delete', path: '/sessions', auth: ACTORS.owner },
  { id: 'sessions.unauthorized', method: 'delete', path: '/sessions' },

  /* ------------------------------- /auth ------------------------------ */
  { id: 'auth.kakao.login', method: 'get', path: '/auth/kakao/login' },
  { id: 'auth.kakao.token', method: 'get', path: '/auth/kakao/token', query: { code: 'auth-code' } },
  {
    id: 'auth.kakao.user',
    method: 'get',
    path: '/auth/kakao/user',
    query: { accessToken: 'kakao-access-token' }
  },
  { id: 'auth.kakao.result', method: 'get', path: '/auth/kakao/result', query: { code: 'auth-code' } }
];

module.exports = { ACTORS, cases };
