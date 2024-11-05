/**
 * swagger-template.js
 *
 * swagger 작성시 해당 템플릿을 가져다 사용하세요
 */

//////////////////////////////////////////////////
//////////////// CREATE API 정의 //////////////////
//////////////////////////////////////////////////
/**
 * @swagger
 * /api/<세부API경로>:
 *   post:
 *     summary: <대상>을 생성
 *     description: <주어진 값>으로 <대상>을 생성
 *     tags: [<태그명>]
 *     parameters:
 *       - in: query
 *         name: <파라미터명>
 *         required: true   // 필수여부 설정(true, false)
 *         schema:
 *           type: <타입>    // 파라미터 타입(string, number, boolean, ...)
 *         description: <파라미터 설명>
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
 *         description: 생성 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: number
 *                   description: 상태코드
 *                   example: 201
 *                 message:
 *                   type: string
 *                   description: 생성완료
 *                   example: 응답 메시지
 *                 data:
 *                   type: object
 *                   description: <예>
 *                   example: 응답 데이터
 *               required:
 *                 - statusCode
 *                 - message
 *                 - data
 */

//////////////////////////////////////////////////
////////////////// GET API 정의 ///////////////////
//////////////////////////////////////////////////
/**
 * @swagger
 * /api/<세부API경로>:
 *   get:
 *     summary: <대상> 조회
 *     description: <수단>을 이용하여 <대상>을 <어떻게> 조회
 *     tags: [<태그명>]
 *     parameters:
 *       - in: query
 *         name: <파라미터명>
 *         required: true   // 필수여부 설정(true, false)
 *         schema:
 *           type: <타입>    // 파라미터 타입(string, number, boolean, ...)
 *         description: <파라미터 설명>
 *     responses:
 *       "200":
 *         description: 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: number
 *                   description: 상태코드
 *                   example: 200
 *                 message:
 *                   type: string
 *                   description: 생성완료
 *                   example: 응답 메시지
 *                 data:
 *                   type: object
 *                   description: <예>
 *                   example: 응답 데이터
 *               required:
 *                 - statusCode
 *                 - message
 *                 - data
 */

/////////////////////////////////////////////////
//////////////// UPDATE API 정의 /////////////////
/////////////////////////////////////////////////
/**
 * @swagger
 * /api/<세부API경로>:
 *   patch:   // 또는 put
 *     summary: <대상>을 업데이트
 *     description: 식별값을 통해 <대상>을 수정할 값으로 업데이트
 *     tags: [<태그명>]
 *     parameters:
 *       - in: query
 *         name: <파라미터명>
 *         required: true   // 필수여부 설정(true, false)
 *         schema:
 *           type: <타입>    // 파라미터 타입(string, number, boolean, ...)
 *         description: <파라미터 설명>
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
 *         description: 업데이트 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: number
 *                   description: 상태코드
 *                   example: 201
 *                 message:
 *                   type: string
 *                   description: 생성완료
 *                   example: 응답 메시지
 *                 data:
 *                   type: object
 *                   description: <예>
 *                   example: 응답 데이터
 *               required:
 *                 - statusCode
 *                 - message
 *                 - data
 */

//////////////////////////////////////////////////
//////////////// DELETE API 정의 //////////////////
//////////////////////////////////////////////////
/**
 * @swagger
 * /api/<서브API 경로>
 *   delete:
 *     summary: <대상>을 논리적으로 삭제
 *     description: 특정 <대상>을 삭제
 *     tags: [<태그명>]
 *     parameters:
 *       - in: query
 *         name: <파라미터명>
 *         required: true   // 필수여부 설정(true, false)
 *         schema:
 *           type: <타입>    // 파라미터 타입(string, number, boolean, ...)
 *         description: <파라미터 설명>
 *     responses:
 *       200:
 *         description: 삭제 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: number
 *                   description: 상태코드
 *                   example: 201
 *                 message:
 *                   type: string
 *                   description: 생성완료
 *                   example: 응답 메시지
 *                 data:
 *                   type: object
 *                   description: <예>
 *                   example: 응답 데이터
 *               required:
 *                 - statusCode
 *                 - message
 *                 - data
 */
