/**
 * routes/index.js
 *  라우트 설정 중앙 관리 및 설정
 */
const ROOT_DIR = process.cwd();

function initialize(app) {
  app.use('/test', require(ROOT_DIR + '/routes/test.controller'));
}

module.exports = { initialize };
