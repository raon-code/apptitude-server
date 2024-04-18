/**
 * crypto.js
 *  암호화 복호화 함수
 */
const crypto = require('crypto');

const config = require('@/config').crypto;
const logger = require('@/config/logger');

const algorithm = config.algorithm;
const key = Buffer.from(sha256Hash(config.seedKey), 'hex');

function sha256Hash(input) {
  const hash = crypto.createHash('sha256');
  hash.update(input);
  return hash.digest('hex');
}

function encrypt(text) {
  const iv = crypto.randomBytes(16); // 매번 새로운 IV를 사용
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(text, 'utf8', 'base64');
  encrypted += cipher.final('base64');
  const result = iv.toString('base64') + ':' + encrypted; // IV를 결과에 포함
  logger.debug(`[Encrypt] Before:${text}, After:${result}`);
  return result;
}

function decrypt(input) {
  const parts = input.split(':'); // IV를 분리
  const iv = Buffer.from(parts.shift(), 'base64');
  const encryptedText = parts.join(':');
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  let decrypted = decipher.update(encryptedText, 'base64', 'utf8');
  decrypted += decipher.final('utf8');
  logger.debug(`[Decrypt] Before:${input}, After:${decrypted}`);
  return decrypted;
}

// 테스트
// logger.warn('앱티튜드');
// const encrypted = encrypt('앱티튜드');
// logger.error(encrypted);
// logger.warn(decrypt(encrypted));

module.exports = {
  encrypt,
  decrypt
};
