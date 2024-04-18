/**
 * const.js
 *  재사용 가능한 전역변수 모음
 */
module.exports = {
  // 프로젝트 루트 디렉토리
  ROOT_DIR: process.cwd(),
  // 서버 디폴트 값
  SERVER_DEFAULT: {
    PORT: 3000,
    NODE_ENV: 'local'
  },
  // 디버그 모드 여부
  DEBUG_MODE: !process.env.NODE_ENV
};
