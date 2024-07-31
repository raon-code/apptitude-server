const request = require('supertest');
const server = require('@/server');
const Common = require('@/models/common');
const logger = require('@/config/logger');
const { GENDER, GENDER_MAP } = require('@/enum/gender');

it('enum 값 가져오기 확인', async () => {
  logger.debug(GENDER.FEMALE.code);
  logger.debug(GENDER.FEMALE.value);
  logger.debug(GENDER.FEMALE.other);
});

it('enumList 값 가져오기 확인', async () => {
  logger.debug(GENDER_MAP);
});
