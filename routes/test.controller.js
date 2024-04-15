/**
 * test.controller.js
 *  테스트 컨트롤러
 */
const router = require('express').Router();

const ROOT_DIR = process.cwd();
const testService = require(ROOT_DIR + '/services/test.service');

router.get('/', getTestList);
async function getTestList(req, res) {
  try {
    const testList = await testService.getTestList();

    const dataList = testList.map((test) => test.toJSON()); // 각 모델 인스턴스를 JSON 객체로 변환
    res.json({
      message: 'success',
      data: dataList
    });
  } catch (error) {
    res.status(500).json({
      message: 'error',
      data: error.message
    });
  }
}

module.exports = router;
