/**
 * test.controller.js
 *  테스트 컨트롤러
 */
const router = require('express').Router();
const { StatusCodes } = require('http-status-codes');

const testService = require('@/services/test-service');
const response = require('@/common/response');
const { asyncException } = require('@/middleware/exception-handler');

// 라우터 명세
// asyncException 포함 필수 (미들웨어를 통해 예외를 잡기위함)
router.get('/', asyncException(getTestList));
// 컨트롤러 함수 정의
async function getTestList(req, res) {
  const testList = await testService.getTestList();
  const dataList = testList.map((test) => test.toJSON()); // 각 모델 인스턴스를 JSON 객체로 변환
  response(res, StatusCodes.OK, '조회성공', dataList);
}

router.get('/error', asyncException(getTestError));
async function getTestError(req, res) {
  await testService.getBizError();
  response(res, StatusCodes.OK, 'Not reach here');
}

module.exports = router;
