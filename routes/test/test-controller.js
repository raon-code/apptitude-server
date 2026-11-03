/**
 * test-controller.js
 *  테스트 컨트롤러
 */
const router = require('express').Router();
const { StatusCodes } = require('http-status-codes');

const testService = require('@/services/test/test-service');
const response = require('@/common/response');
const logger = require('@/config/logger');

router.post('/', createTest);
async function createTest(req, res) {
  const newTest = await testService.createTest(
    req.body.title,
    req.body.contents
  );
  response(res, StatusCodes.CREATED, 'Created', newTest);
}

// 라우터 명세
router.get('/', getTestList);
// 컨트롤러 함수 정의
async function getTestList(req, res) {
  const testList = await testService.getTestList();
  response(res, StatusCodes.OK, '조회성공', testList);
}

router.get('/:id', getTest);
async function getTest(req, res) {
  const id = req.params.id;
  const test = await testService.getTest(id);
  response(res, StatusCodes.OK, '조회성공', test);
}

router.get('/error', getTestError);
async function getTestError(req, res) {
  await testService.getBizError();
}

router.patch('/:id', updateTest);
async function updateTest(req, res) {
  const id = req.params.id;
  const updateParams = req.body.updateParams;
  const updatedTest = await testService.updateTest(id, updateParams);
  response(res, StatusCodes.OK, '업데이트 성공', updatedTest);
}

router.delete('/:id', deleteTest);
async function deleteTest(req, res) {
  const id = req.params.id;
  await testService.deleteTest(id);
  response(res, StatusCodes.OK, '삭제 성공', {});
}

module.exports = router;
