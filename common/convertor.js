/**
 * convertor.js
 *  각종 변환 공통함수
 */
const ROOT_DIR = process.cwd();
const logger = require(ROOT_DIR + '/config/logger');

const KST_OFFSET = 9 * 60 * 60000;

/**
 *
 * @param {Date} utcDate
 * @returns
 */
function toKSTDate(utcDate) {}

/**
 *
 * @param {Date} kstDate
 * @returns
 */
function toUTCDate(kstDate) {}

module.exports = {
  toKSTDate,
  toUTCDate
};
