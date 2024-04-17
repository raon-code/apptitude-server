/**
 * const.js
 *  재사용 가능한 전역변수 모음
 */
module.exports = {
  ROOT_DIR: process.cwd(),
  DEFAULT: {
    PORT: 3000,
    NODE_ENV: 'local'
  },
  DEBUG_MODE: !process.env.NODE_ENV
};
