/**
 * jest setupFiles
 *   config/env.js 의 fail-fast 검증을 통과하기 위한 결정적 테스트 값
 */
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-jwt-secret-0123456789';
process.env.CRYPTO_SEED_KEY = 'test-crypto-seed-0123456789';
process.env.KAKAO_REST_API_KEY = 'test-kakao-rest-api-key';
