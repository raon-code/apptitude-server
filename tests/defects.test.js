const request = require('supertest');

const { server, seedUsers, seedBattle, tokenFor } = require('./helpers/seed');

describe('알려진 결함 회귀 테스트', () => {
  const userId = 9001;
  const friendId = 9002;
  const battleId = 9101;
  let token;

  beforeAll(async () => {
    await server.ready;
    await seedUsers([userId, friendId]);
    await seedBattle({ userId, battleId });
    token = tokenFor(userId);
  });

  it('POST /friends — CreateFriendDTO import 누락 없이 생성된다', async () => {
    const res = await request(server)
      .post('/friends')
      .set('Authorization', `Bearer ${token}`)
      .send({ friendId });

    expect(res.status).toBe(201);
    expect(res.body.data.friendId).toBe(friendId);
  });

  it('GET /battles/:id/histories — 없는 대결은 404', async () => {
    const res = await request(server)
      .get('/battles/999999/histories')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(404);
  });

  it('GET /battles/:id — 참여자는 200', async () => {
    const res = await request(server)
      .get(`/battles/${battleId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.data.id).toBe(battleId);
  });

  it('GET /battles/:id/histories — 참여자는 200', async () => {
    const res = await request(server)
      .get(`/battles/${battleId}/histories`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('DELETE /battles/:id — 라우트 경로가 유효하다', async () => {
    const res = await request(server)
      .delete(`/battles/${battleId}`)
      .query({ isCancel: true })
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
  });
});
