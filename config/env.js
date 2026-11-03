/**
 * env.js
 *   환경변수 로딩 및 검증
 *
 *   필수 환경변수가 없으면 부팅 즉시 실패한다(fail-fast).
 *   값은 .env(로컬) 또는 배포 환경(systemd EnvironmentFile 등)에서 주입한다.
 */
const Joi = require('joi');

const { DEV, PROD } = require('./const');

const dbField = () =>
  Joi.string().when('NODE_ENV', {
    is: Joi.valid(DEV, PROD),
    then: Joi.required(),
    otherwise: Joi.optional()
  });

const schema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('local', DEV, PROD, 'test')
    .default('local'),
  JWT_SECRET: Joi.string().min(16).required(),
  CRYPTO_SEED_KEY: Joi.string().min(16).required(),
  KAKAO_REST_API_KEY: Joi.string().required(),
  DB_HOST: dbField(),
  DB_PORT: Joi.number().default(3306),
  DB_NAME: dbField(),
  DB_USER: dbField(),
  DB_PASSWORD: dbField()
}).unknown(true);

const { value, error } = schema.validate(process.env, {
  abortEarly: false,
  convert: true
});

if (error) {
  const details = error.details.map((detail) => detail.message).join('\n');
  throw new Error(`환경변수 검증 실패:\n${details}`);
}

module.exports = value;
