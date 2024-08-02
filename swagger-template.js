/**
 * swagger-template.js
 *
 * swagger 작성시 해당 템플릿을 가져다 사용하세요
 */

//////////////// CREATE API 정의 //////////////////
/**
 * @swagger
 * /api/<세부API경로>:
 *   post:
 *     summary: <대상>을 생성
 *     description: <주어진 값>으로 <대상>을 생성
 *     tags: [<태그명>]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - <필요값-1>
 *               - <필요값-2>
 *               - <등등..>
 *             properties:
 *               <필요값-1>:
 *                 type: <타입>
 *                 description: <설명>
 *                 example: <예>
 *              <필요값-2>:
 *                 type: <타입>
 *                 description: <설명>
 *                 example: <예>
 *              <등등..>:
 *                 type: <타입>
 *                 description: <설명>
 *                 example: <예>
 *     responses:
 *       201:
 *         description: <대상>을 성공적으로 생성
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
 *                     <반환값-1>:
 *                       type: <타입>
 *                       description: <설명>
 *                       example: <예>
 *                     <등등..>:
 *                       type: <타입>
 *                       description: <설명>
 *                       example: <예>
 *               required:
 *                 - statusCode
 *                 - message
 *                 - data
 */

//////////////// GET API 정의 //////////////////
/**
 * @swagger
 * /api/<세부API경로>:
 *   get:
 *     summary: <대상> 조회
 *     description: <수단>을 이용하여 <대상>을 <어떻게> 조회
 *     tags: [<태그명>]
 *     responses:
 *       "200":
 *         description: <결과 데이터 설명>
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
 *                         "<결과요소키값-A1>": "<결과요소값-A1>",
 *                         "<결과요소키값-A2>": "<결과요소값-A2>",
 *                       },
 * {                     {
 *                         "<결과요소키값-B1>": "<결과요소값-B1>",
 *                         "<결과요소키값-B2>": "<결과요소값-B2>",
 *                       },
 *                     ]
 *               required:
 *                 - statusCode
 *                 - message
 *                 - data
 */

//////////////// UPDATE API 정의 //////////////////
/**
 * @swagger
 * /api/<세부API경로>:
 *   patch<or Update>:
 *     summary: <대상>을 업데이트
 *     description: 식별값을 통해 <대상>을 수정할 값으로 업데이트
 *     tags: [<태그명>]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: <업데이트 대상 ID 설명>
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
 *                  - <필요값-1>
 *                  - <필요값-2>
 *                  - <등등..>
 *             properties:
 *               <필요값-1>:
 *                 type: <타입>
 *                 description: <설명>
 *                 example: <예>
 *              <필요값-2>:
 *                 type: <타입>
 *                 description: <설명>
 *                 example: <예>
 *              <등등..>:
 *                 type: <타입>
 *                 description: <설명>
 *                 example: <예>
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

//////////////// DELETE API 정의 //////////////////
/**
 * @swagger
 * /api/<서브API 경로>
 *   delete:
 *     summary: <대상>을 논리적으로 삭제
 *     description: 특정 <대상>을 삭제
 *     tags: [<태그명>]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: <삭제 대상 ID 설명>
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Delete successfully.
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
