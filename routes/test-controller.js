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
 * /api/tests:
 *   post:
 *     summary: Create a new test
 *     description: Creates a new test with the given title and contents.
 *     tags: [Tests]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - contents
 *             properties:
 *               title:
 *                 type: string
 *                 description: The title of the test.
 *                 example: '앱티튜드 테스트 제목'
 *               contents:
 *                 type: string
 *                 description: The contents of the test.
 *                 example: '앱티튜드 테스트 내용'
 *     responses:
 *       201:
 *         description: Successfully created new test.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: number
 *                   example: 201
 *                 message:
 *                   type: string
 *                   example: 'Created'
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       description: The unique identifier of the new test.
 *                       example: 'abc123'
 *                     dateTime:
 *                       type: string
 *                       description: The unique identifier of the new test.
 *                       example: '2024-04-16T09:29:24.000Z'
 *                     title:
 *                       type: string
 *                       description: The title of the test.
 *                       example: 'Math Test'
 *                     contents:
 *                       type: string
 *                       description: The contents of the test.
 *                       example: 'This is a test about basic algebra.'
 *               required:
 *                 - statusCode
 *                 - message
 *                 - data
 */
router.post('/', createTest);
async function createTest(req, res) {
  const newTest = await testService.createTest(
    req.body.title,
    req.body.contents
  );
  response(res, StatusCodes.CREATED, 'Created', newTest);
}

/**
 * @swagger
 * /api/tests:
 *   get:
 *     summary: "테스트 데이터 전체조회"
 *     description: "테스트 데이터 전체를 Get방식으로 요청"
 *     tags: [Tests]
 *     responses:
 *       "200":
 *         description: 테스트 전체 정보
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: number
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: 조회성공
 *                 data:
 *                   type: object
 *                   example:
 *                     [
 *                       {
 *                         "title": "앱티튜트 테스트 제목 1",
 *                         "content": "앱티튜트 테스트 내용 1",
 *                       },
 *                       {
 *                         "title": "앱티튜트 테스트 제목 2",
 *                         "content": "앱티튜트 테스트 내용 2",
 *                       },
 *                       {
 *                         "title": "앱티튜트 테스트 제목 3",
 *                         "content": "앱티튜트 테스트 내용 3",
 *                       },
 *                     ]
 *               required:
 *                 - statusCode
 *                 - message
 *                 - data
 */
// 라우터 명세
router.get('/', getTestList);
// 컨트롤러 함수 정의
async function getTestList(req, res) {
  const testList = await testService.getTestList();
  response(res, StatusCodes.OK, '조회성공', testList);
}

/**
 * @swagger
 * /api/tests/{id}:
 *   get:
 *     summary: Retrieve a test by its ID
 *     description: Fetch a single test by its ID from the database and return the test details.
 *     tags: [Tests]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the test to retrieve.
 *         schema:
 *           type: string
 *           example: '123'
 *     responses:
 *       200:
 *         description: Test retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: number
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: '조회성공'
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       description: The unique identifier of the test.
 *                       example: '123'
 *                     name:
 *                       type: string
 *                       description: The name of the test.
 *                       example: 'Chemistry Test'
 *                     details:
 *                       type: string
 *                       description: Detailed description of the test.
 *                       example: 'Final exam for chemistry class.'
 *               required:
 *                 - statusCode
 *                 - message
 *                 - data
 */
router.get('/:id(\\d+)', getTest);
async function getTest(req, res) {
  const id = req.params.id;
  const test = await testService.getTest(id);
  response(res, StatusCodes.OK, '조회성공', test);
}

/**
 * @swagger
 * paths:
 *   /api/tests/error:
 *     get:
 *       summary: "에러 핸들링 테스트"
 *       description: "의도적으로 비즈니스 에러를 발생, 에러에 대한 핸들링이 정상적으로 작동하는지 확인"
 *       tags: [Tests]
 *       responses:
 *         "400":
 *           description: 에러 내용
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   statusCode:
 *                     type: number
 *                     example: 400
 *                   message:
 *                     type: string
 *                     example: "Bad Request: 에러 테스트 입니다!!"
 *                   data:
 *                     type: object
 *                     example:
 *                       {
 *                         "name": "Bad Request",
 *                         "message": "에러 테스트 입니다!!",
 *                         "stack": "<Error Stack>",
 *                       }
 *                   required:
 *                     - statusCode
 *                     - message
 *                     - data
 */
router.get('/error', getTestError);
async function getTestError(req, res) {
  await testService.getBizError();
}

/**
 * @swagger
 * /api/tests/{id}:
 *   patch:
 *     summary: Update a test
 *     description: Updates a test's title and content based on the given ID.
 *     tags: [Tests]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the test to update.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               updateParams:
 *                 type: object
 *                 required:
 *                   - title
 *                   - contents
 *                 properties:
 *                   title:
 *                     type: string
 *                     description: The new title of the test.
 *                     example: "Updated Test Title"
 *                   contents:
 *                     type: string
 *                     description: The new content of the test.
 *                     example: "Updated test content details."
 *     responses:
 *       200:
 *         description: Test updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: number
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: "업데이트 성공"
 *                 data:
 *                   type: object
 *                   example: {}
 *               required:
 *                 - statusCode
 *                 - message
 *                 - data
 */
router.patch('/:id(\\d+)', updateTest);
async function updateTest(req, res) {
  const id = req.params.id;
  const updateParams = req.body.updateParams;
  const updatedTest = await testService.updateTest(id, updateParams);
  response(res, StatusCodes.OK, '업데이트 성공', updatedTest);
}

/**
 * @swagger
 * /api/tests/{id}:
 *   delete:
 *     summary: Delete a test
 *     description: Deletes a test based on the given ID.
 *     tags: [Tests]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the test to update.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Test updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: number
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: "삭제 성공"
 *                 data:
 *                   type: object
 *                   example: {}
 *               required:
 *                 - statusCode
 *                 - message
 *                 - data
 */
router.delete('/:id(\\d+)', deleteTest);
async function deleteTest(req, res) {
  const id = req.params.id;
  await testService.deleteTest(id);
  response(res, StatusCodes.OK, '삭제 성공', {});
}

module.exports = router;
