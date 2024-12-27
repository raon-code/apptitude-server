/**
 * math.js
 *   수와 관련된 공통합수
 */
const logger = require('@/config/logger');

/**
 * 랜덤 숫자를 반환합니다.
 *
 * @param {number} min 랜덤 최소값
 * @param {number} max 랜덤 최대값
 * @returns {number} 랜덤 숫자(최소값<=X<최대값)
 */
function getRandomFloat(min, max) {
  return Math.random() * (max - min) + min;
}

module.exports = { getRandomFloat };
