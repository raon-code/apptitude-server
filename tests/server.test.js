const request = require('supertest');
const server = require('@/server');

describe(`GET /api/test`, () => {
  it('테스트 리스트 조회', async () => {
    const res = await request(server).get(`/api/test`);
    expect(res.body.statusCode).toBe(200);
    expect(res.body.data.length).toBeGreaterThan(0);
  });
});
