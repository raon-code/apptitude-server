/**
 * slowdown.js
 *   디도스 공격을 방지하기 위한 설정입니다.
 */
const { slowDown } = require('express-slow-down');
const { SEC_TO_MS } = require('@/config/const');

const WINDOW_MS = 1 * SEC_TO_MS;
const DELAY_OFFSET_MS = Math.ceil(WINDOW_MS / 2);

const ddosDefender = slowDown({
  // windowMs 밀리초 당,
  windowMs: WINDOW_MS,
  // delayAfter 번 요청만을 허용합니다.
  delayAfter: 10,
  // 그 이후의 요청에 대해서는 요청마다 delayMs 만큼 딜레이 됩니다.
  delayMs: (hits) => hits * DELAY_OFFSET_MS,
  maxDelayMs: 20 * DELAY_OFFSET_MS

  /**
   * example)
   * - 요청 <delayAfter>번 까지는 딜레이되지 않음
   * - <delayAfter> + 1 는 1 * DELAY_OFFSET_MS 만큼 딜레이 됩니다.
   * - <delayAfter> + 2 는 2 * DELAY_OFFSET_MS 만큼 딜레이 됩니다.
   * - ...
   *
   * 그리고 windowMs이 지나면 초기화됩니다.
   */
});

module.exports = ddosDefender;
