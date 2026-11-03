const request = require('supertest');

const { server, seedUsers, seedBattle, tokenFor } = require('./helpers/seed');
const Friend = require('@/models/friend');
const UserDevice = require('@/models/user-device');
const Battle = require('@/models/battle');
const BattleDetail = require('@/models/battle-detail');

describe('추가 결함 회귀 테스트', () => {
  const ownerId = 9201;
  const otherId = 9202;
  const freshId = 9203;
  const battleId = 9201;
  let ownerToken;
  let otherToken;
  let freshToken;
  let friendPkId;
  let deviceId;

  beforeAll(async () => {
    await server.ready;
    await seedUsers([ownerId, otherId, freshId]);
    await Battle.destroy({ where: { userId: freshId } });
    await seedBattle({ userId: ownerId, battleId });

    ownerToken = tokenFor(ownerId);
    otherToken = tokenFor(otherId);
    freshToken = tokenFor(freshId);

    const friend = await Friend.create({ userId: ownerId, friendId: otherId });
    friendPkId = friend.id;

    const device = await UserDevice.create({
      uuid: 'defect-device',
      osType: 'OT1',
      osVersion: '17.0',
      isUsing: true,
      userId: ownerId
    });
    deviceId = device.id;
  });

  it('GET /friends — include 조인에서 모호한 컬럼 없이 조회된다', async () => {
    const res = await request(server)
      .get('/friends')
      .set('Authorization', `Bearer ${ownerToken}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('GET /friends/:id — 단건 조회가 500 없이 동작한다', async () => {
    const res = await request(server)
      .get(`/friends/${friendPkId}`)
      .set('Authorization', `Bearer ${ownerToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data.id).toBe(friendPkId);
  });

  it('GET /devices/:id — 본인 기기는 200, 없는 기기는 404', async () => {
    const own = await request(server)
      .get(`/devices/${deviceId}`)
      .set('Authorization', `Bearer ${ownerToken}`);
    expect(own.status).toBe(200);
    expect(own.body.data.id).toBe(deviceId);

    const missing = await request(server)
      .get('/devices/99999')
      .set('Authorization', `Bearer ${ownerToken}`);
    expect(missing.status).toBe(404);
  });

  it('POST /battles — 생성 응답에 auto-increment id가 포함된다', async () => {
    const res = await request(server)
      .post('/battles')
      .set('Authorization', `Bearer ${freshToken}`)
      .send({
        name: '생성 테스트',
        startDate: '2024-01-01',
        endDate: '2024-01-31',
        reward: '커피'
      });

    expect(res.status).toBe(201);
    expect(Number.isInteger(res.body.data.id)).toBe(true);
  });

  it('PATCH /battles/:id — 방장이 아니면 400', async () => {
    const res = await request(server)
      .patch(`/battles/${battleId}`)
      .set('Authorization', `Bearer ${otherToken}`)
      .send({});

    expect(res.status).toBe(400);
    expect(res.body.message).toContain('권한이 없습니다');
  });

  it('GET /battles/:id/details — 참여자가 아니면 400', async () => {
    const res = await request(server)
      .get(`/battles/${battleId}/details`)
      .set('Authorization', `Bearer ${otherToken}`);

    expect(res.status).toBe(400);
    expect(res.body.message).toContain('참가한 사용자가 아닙니다');
  });

  it('PATCH /battles/:id/details/:detailId — 식별자 mass assignment 차단', async () => {
    const before = await BattleDetail.findByPk(battleId);
    const res = await request(server)
      .patch(`/battles/${battleId}/details/${battleId}`)
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({
        detoxTime: 20,
        id: 99999,
        userId: otherId,
        battleId: 99999
      });

    expect(res.status).toBe(200);
    expect(res.body.data.id).toBe(before.id);
    expect(res.body.data.userId).toBe(before.userId);
    expect(res.body.data.battleId).toBe(before.battleId);
    expect(res.body.data.detoxTime).toBe(20);
  });

  it('POST /battles/:id/histories — 대결내역 생성이 201', async () => {
    const res = await request(server)
      .post(`/battles/${battleId}/histories`)
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({ detoxTime: 10, battleDate: '2024-01-01' });

    expect(res.status).toBe(201);
    expect(res.body.data.battleId).toBe(battleId);
  });

  it('POST /battles/:id/invitations — 초대 링크 생성이 201, 없는 대결은 404', async () => {
    const created = await request(server)
      .post(`/battles/${battleId}/invitations`)
      .set('Authorization', `Bearer ${ownerToken}`);
    expect(created.status).toBe(201);
    expect(typeof created.body.data.inviteUrl).toBe('string');

    const missing = await request(server)
      .post('/battles/99999/invitations')
      .set('Authorization', `Bearer ${ownerToken}`);
    expect(missing.status).toBe(404);
  });

  it('GET /users/:id — 다른 사용자 조회는 401', async () => {
    const res = await request(server)
      .get(`/users/${otherId}`)
      .set('Authorization', `Bearer ${ownerToken}`);

    expect(res.status).toBe(401);
  });

  it('GET /battles/:id — 없는 대결은 404', async () => {
    const res = await request(server)
      .get('/battles/99999')
      .set('Authorization', `Bearer ${ownerToken}`);

    expect(res.status).toBe(404);
  });
});
