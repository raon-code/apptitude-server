/**
 * test.controller.js
 *  테스트 컨트롤러
 */
const router = require('express').Router();
const { StatusCodes } = require('http-status-codes');

const testService = require('@/services/test.service');
const response = require('@/common/response');

router.get('/', getTestList);
async function getTestList(req, res) {
  try {
    const testList = await testService.getTestList();

    const dataList = testList.map((test) => test.toJSON()); // 각 모델 인스턴스를 JSON 객체로 변환
    response(res, StatusCodes.OK, '조회성공', dataList);
  } catch (error) {
    response(res, StatusCodes.INTERNAL_SERVER_ERROR, '조회실패', error.message);
  }
}

module.exports = router;
