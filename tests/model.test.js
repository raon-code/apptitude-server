const request = require('supertest');
const server = require('@/server');
const Common = require('@/models/common');
const logger = require('@/config/logger');

it('Common 모델 초기화 성공여부 확인', async () => {
  const commonList = await Common.findAll();
  logger.debug(commonList);
});
