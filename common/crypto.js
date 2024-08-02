/**
 * crypto.js
 *  암호화 복호화 공통함수
 */
const crypto = require('crypto');

const config = require('@/config').crypto;
const logger = require('@/config/logger');

const algorithm = config.algorithm;
const key = Buffer.from(hashEncrypt(config.seedKey), 'hex');

/**
 * 해시알고리즘을 사용한 암호화를 합니다.
 * (복호화 불가능)
 *
 * @param {string} input 문자열
 * @returns 해시 암호화된 문자열
 */
function hashEncrypt(input) {
  const hash = crypto.createHash('sha256');
  hash.update(input);
  return hash.digest('hex');
}

/**
 * 문자열을 암호화합니다.
 *
 * 암호화패턴
 *   <랜덤IV값>:<암호화문자열>
 *
 * @param {string} text 문자열
 * @returns 암호화된 문자열
 */
function encrypt(text) {
  const iv = crypto.randomBytes(16); // 매번 새로운 IV를 사용

  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(text, 'utf8', 'base64');
  encrypted += cipher.final('base64');
  const result = iv.toString('base64') + ':' + encrypted; // IV를 결과에 포함
  logger.debug(`[Encrypt] Before:${text}, After:${result}`);
  return result;
}

/**
 * 암호화된 문자열을 복호화합니다.
 *
 * 암호화패턴
 *   <랜덤IV값>:<암호화문자열>
 *
 * ':' 앞에 <랜덤IV값>을 먼저 가져옵니다.
 * 그리고, <랜덤IV값>을 이용해 ':' 뒤에 <암호화문자열>을 복호화 합니다.
 *
 * @param {string} input 암호화된 문자열
 * @returns 복호화된 문자열
 */
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

module.exports = {
  hashEncrypt,
  encrypt,
  decrypt
};
