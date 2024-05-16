const request = require('supertest');
const server = require('@/server');
const logger = require('@/config/logger');
const GENDER = require('@/enum/gender');
const AGE_RANGE = require('@/enum/age-range');
const { generateJwtToken } = require('@/config/security/jwt');

it('jwt 토큰 생성', async () => {
  const user = {
    id: 1,
    email: 'sb92120@gmail.com',
    name: '김승범',
    gender: GENDER.MALE.getCode(),
    ageRange: AGE_RANGE.AGE_30.getCode()
  };

  const jwt = generateJwtToken(user);
  logger.debug(jwt);
});
