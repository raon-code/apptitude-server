const request = require('supertest');
const server = require('@/server');
const testService = require('@/services/test/test-service');

describe(`GET /tests`, () => {
  beforeAll(async () => {
    await server.ready;
    await testService.createTest('테스트 제목', '테스트 내용');
  });

  it('테스트 리스트 조회', async () => {
    const res = await request(server).get(`/tests`);
    expect(res.body.statusCode).toBe(200);
    expect(res.body.data.length).toBeGreaterThan(0);
  });
});
