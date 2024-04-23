/**
 * test.controller.js
 *  테스트 컨트롤러
 */
const router = require('express').Router();
const { StatusCodes } = require('http-status-codes');

const testService = require('@/services/test-service');
const response = require('@/common/response');

/**
 * @swagger
 * paths:
 *  /api/tests:
 *    get:
 *      summary: "테스트 데이터 전체조회"
 *      description: "테스트 데이터 전테를 Get방식으로 요청"
 *      tags: [Tests]
 *      responses:
 *        "200":
 *          description: 테스트 전체 정보
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  statusCode:
 *                    type: number
 *                    example: 200
 *                  message:
 *                    type: string
 *                    example: 조회성공
 *                  data:
 *                    type: object
 *                    example:
 *                      [
 *                        {"title": "앱티튜트 테스트 제목 1", "content": "앱티튜트 테스트 내용 1"},
 *                        {"title": "앱티튜트 테스트 제목 2", "content": "앱티튜트 테스트 내용 2"},
 *                        {"title": "앱티튜트 테스트 제목 3", "content": "앱티튜트 테스트 내용 3"}
 *                      ]
 */
// 라우터 명세
router.get('/', getTestList);
// 컨트롤러 함수 정의
async function getTestList(req, res) {
  const testList = await testService.getTestList();
  const dataList = testList.map((test) => test.toJSON()); // 각 모델 인스턴스를 JSON 객체로 변환
  response(res, StatusCodes.OK, '조회성공', dataList);
}

/**
 * @swagger
 * paths:
 *  /api/tests/error:
 *    get:
 *      summary: "에러 핸들링 테스트"
 *      description: "의도적으로 비즈니스 에러를 발생, 에러에 대한 핸들링이 정상적으로 작동하는지 확인"
 *      tags: [Tests]
 *      responses:
 *        "400":
 *          description: 에러 내용
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  statusCode:
 *                    type: number
 *                    example: 400
 *                  message:
 *                    type: string
 *                    example: "Bad Request: 에러 테스트 입니다!!"
 *                  data:
 *                    type: object
 *                    example: {
 *                               "name": "Bad Request",
 *                               "message": "에러 테스트 입니다!!",
 *                               "stack": "<Error Stack>"
 *                             }
 *
 */
router.get('/error', getTestError);
async function getTestError(req, res) {
  await testService.getBizError();
}

module.exports = router;
