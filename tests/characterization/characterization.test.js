/**
 * tests/characterization/characterization.test.js
 *
 *  엔드포인트 명세화(characterization) 테스트
 *
 *  - routes/index.js 에 마운트된 모든 핸들러를 cases.js 순서대로 호출한다.
 *  - 응답은 volatile 값(id/토큰/타임스탬프 등)을 placeholder로 정규화한 뒤
 *    __fixtures__/responses.json 의 기준선과 toEqual 로 비교한다.
 *  - 기준선을 다시 만들려면:
 *      UPDATE_FIXTURES=1 npx jest tests/characterization --runInBand --forceExit
 *
 *  격리
 *  - 전용 SQLite 파일(database.characterization.sqlite)을 사용하고,
 *    실행 시작 시 파일을 삭제하므로 id/autoincrement 값이 매번 동일하다.
 *    (jest는 파일 단위로 모듈 레지스트리를 초기화하므로 다른 테스트 파일의
 *     database.sqlite 연결과 섞이지 않는다)
 *
 *  외부 I/O
 *  - /auth/kakao/token, /user, /result 는 카카오 API를 호출하므로
 *    axios 를 jest.mock 으로 대체한다(외부 네트워크 호출 없음).
 */
const fs = require('fs');
const path = require('path');

// 전용 DB 경로 지정 (server/models 를 require 하기 전에 설정해야 한다)
const config = require('@/config');
const DB_FILE = path.join(process.cwd(), 'database.characterization.sqlite');
config.database.sqlite.storagePath = DB_FILE;
if (fs.existsSync(DB_FILE)) {
  fs.unlinkSync(DB_FILE);
}

jest.mock('axios');

const axios = require('axios');
const request = require('supertest');

const { server, seedUsers, seedBattle, tokenFor } = require('../helpers/seed');
const User = require('@/models/user');
const LoginPlatform = require('@/models/login-platform');
const Test = require('@/models/test');
const { STATUS_TYPE } = require('@/enum/status-type');
const { generateJwtRefreshToken } = require('@/config/security/jwt');

const { ACTORS, cases } = require('./cases');

const FIXTURE_DIR = path.join(__dirname, '__fixtures__');
const FIXTURE_FILE = path.join(FIXTURE_DIR, 'responses.json');
const UPDATE_FIXTURES = process.env.UPDATE_FIXTURES === '1';

jest.setTimeout(180000);

// 카카오 API 고정 응답 (외부 I/O 대체)
const KAKAO_TOKEN_RESPONSE = {
  access_token: 'kakao-access-token',
  token_type: 'bearer',
  expires_in: 43199,
  refresh_token: 'kakao-refresh-token',
  scope: 'profile_nickname'
};
const KAKAO_USER_RESPONSE = {
  id: 123456789,
  connected_at: '2024-01-01T00:00:00Z',
  properties: { nickname: '카카오테스트' },
  kakao_account: { profile: { nickname: '카카오테스트' } }
};

/* ------------------------------ 정규화 ------------------------------ */

// logger colorize 설정이 일부 에러 메시지에 ANSI 코드를 남긴다(응답 값 자체는 아님).
// eslint-disable-next-line no-control-regex -- ANSI 이스케이프 제거용 의도된 패턴
const ANSI_PATTERN = /\u001b\[[0-9;]*m/g;

// 실행 시점에 따라 달라지는 값
const TIMESTAMP_KEYS = new Set([
  'createdAt',
  'updatedAt',
  'dateTime',
  'lastLogin',
  'withdrawDate',
  'startDate',
  'endDate',
  'battleDate',
  'connected_at'
]);

// 비밀값/1회성 값
const SECRET_KEYS = new Set([
  'accessToken',
  'refreshJwt',
  'access_token',
  'refresh_token',
  'expires_in',
  'iat',
  'exp',
  'inviteLink',
  'inviteUrl'
]);

const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?Z$/;
const JWT_PATTERN = /^eyJ[\w-]*\.[\w-]+\.[\w-]+$/;

/**
 * volatile 값을 안정적인 placeholder로 치환한다.
 * key 순서와 배열 순서는 그대로 유지한다.
 */
function normalizeValue(value, key) {
  if (value === null || value === undefined) {
    return value;
  }

  if (typeof key === 'string') {
    if (key === 'stack') return '<stack>';
    if (TIMESTAMP_KEYS.has(key)) return '<timestamp>';
    if (SECRET_KEYS.has(key)) return `<${key}>`;
  }

  if (Array.isArray(value)) {
    return value.map((item) => normalizeValue(item, null));
  }

  if (typeof value === 'object') {
    const normalized = {};
    for (const [childKey, childValue] of Object.entries(value)) {
      normalized[childKey] = normalizeValue(childValue, childKey);
    }
    return normalized;
  }

  if (typeof value === 'string') {
    const stripped = value.replace(ANSI_PATTERN, '');
    if (JWT_PATTERN.test(stripped)) return '<jwt>';
    if (ISO_DATE_PATTERN.test(stripped)) return '<timestamp>';
    return stripped;
  }

  return value;
}

function normalize(value) {
  return normalizeValue(value, null);
}

/* ---------------------------- 케이스 실행 ---------------------------- */

async function runCase(testCase) {
  let req = request(server)[testCase.method](testCase.path);

  if (testCase.auth !== undefined) {
    req = req.set('Authorization', `Bearer ${tokenFor(testCase.auth)}`);
  }
  if (testCase.query) {
    req = req.query(testCase.query);
  }
  if (testCase.body !== undefined) {
    req = req.send(testCase.body);
  }

  const res = await req;
  const captured = { status: res.status, body: normalize(res.body) };
  if (res.headers.location) {
    captured.location = res.headers.location;
  }
  return captured;
}

// 응답 기준선 이외에 반드시 지켜져야 하는 계약
const EXTRA_CHECKS = {
  'auth.kakao.login': (actual) => {
    expect(actual.status).toBe(302);
    expect(actual.location).toMatch(
      /^https:\/\/kauth\.kakao\.com\/oauth\/authorize\?response_type=code/
    );
  }
};

/* ------------------------------ 테스트 ------------------------------ */

const existingFixtures = fs.existsSync(FIXTURE_FILE)
  ? JSON.parse(fs.readFileSync(FIXTURE_FILE, 'utf8'))
  : {};

const collected = {};

beforeAll(async () => {
  await server.ready;

  // 카카오 API mock
  axios.post.mockResolvedValue({ data: KAKAO_TOKEN_RESPONSE });
  axios.get.mockResolvedValue({ data: KAKAO_USER_RESPONSE });

  await seedUsers([ACTORS.owner, ACTORS.friend, ACTORS.stranger]);

  // users PATCH 가 리프레시 토큰을 재발급하므로 미리 넣어둔다
  await User.update(
    { refreshJwt: generateJwtRefreshToken({ id: ACTORS.owner }) },
    { where: { id: ACTORS.owner } }
  );

  // /sessions 로그인에 필요한 로그인 플랫폼
  await LoginPlatform.create({
    id: 1,
    platformType: 'PT0',
    uuid: 'seeded-login-uuid',
    userId: ACTORS.owner
  });

  // GET /tests/:id 기준 데이터 (id는 고정)
  await Test.create({
    id: 201,
    dateTime: new Date('2024-01-01T00:00:00.000Z'),
    title: '시드 제목',
    contents: '시드 내용'
  });

  // 대결: 대기(101) / 진행(102) / 대기(103, 상세 생성용), 각 대결상세는 battleId와 같은 id 사용
  await seedBattle({
    userId: ACTORS.owner,
    battleId: 101,
    statusType: STATUS_TYPE.WAIT.code
  });
  await seedBattle({
    userId: ACTORS.owner,
    battleId: 102,
    statusType: STATUS_TYPE.PROCEED.code
  });
  await seedBattle({
    userId: ACTORS.owner,
    battleId: 103,
    statusType: STATUS_TYPE.WAIT.code
  });
});

describe('characterization: 마운트된 모든 라우트 응답 기준선', () => {
  for (const testCase of cases) {
    it(`${testCase.id} — ${testCase.method.toUpperCase()} ${testCase.path}`, async () => {
      const actual = await runCase(testCase);
      collected[testCase.id] = actual;

      if (EXTRA_CHECKS[testCase.id]) {
        EXTRA_CHECKS[testCase.id](actual);
      }

      if (UPDATE_FIXTURES) {
        return;
      }

      const expected = existingFixtures[testCase.id];
      if (expected === undefined) {
        throw new Error(
          `기준선이 없습니다: ${testCase.id}. ` +
            'UPDATE_FIXTURES=1 npx jest tests/characterization --runInBand --forceExit 로 생성하세요.'
        );
      }
      expect(actual).toEqual(expected);
    });
  }
});

afterAll(() => {
  if (!UPDATE_FIXTURES) {
    return;
  }
  fs.mkdirSync(FIXTURE_DIR, { recursive: true });
  fs.writeFileSync(FIXTURE_FILE, JSON.stringify(collected, null, 2) + '\n');
});
