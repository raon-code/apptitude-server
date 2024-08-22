/**
 * friend-controller.js
 *  친구 관련 컨트롤러
 *
 *  BASE URI: /friends
 *
 */
const router = require('express').Router();
const { StatusCodes } = require('http-status-codes');

const response = require('@/common/response');
const { authMiddleware } = require('@/middleware/auth-handler');

const userService = require('@/services/user-service');
const friendService = require('@/services/friend-service');

const { ConflictError, NotFoundError, BizError } = require('@/error');

// 인증 미들웨어를 모든 요청에 적용
router.use((req, res, next) => {
  // 토큰확인
  authMiddleware(req, res, next);

  next();
});

/**
 * @swagger
 * /friends:
 *  post:
 *    summary: 친구 추가
 *    description: 사용자의 친구를 추가
 *    tags: [Friends]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - friendId
 *            properties:
 *              friendId:
 *                type: number
 *                description: 등록할 친구 ID
 *                example: 1
 *    responses:
 *      201:
 *        description: 친구를 성공적으로 생성
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                statusCode:
 *                  type: number
 *                  example: 201
 *                message:
 *                  type: string
 *                  example: 'Created'
 *                data:
 *                  type: object
 *                  description: 생성한 친구 정보
 *                  properties:
 *                    id:
 *                      type: number
 *                      example: 1
 *                    userId:
 *                      type: number
 *                      example: 1
 *                    friendId:
 *                      type: number
 *                      example: 2
 *              required:
 *                - statusCode
 *                - message
 *                - data
 */
router.post('/', createFriend);
async function createFriend(req, res) {
  const userId = req.user.id;
  const friendId = req.body.friendId;

  const createFriendDTO = CreateFriendDTO.fromPlainObject({ userId, friendId });
  createFriendDTO.validate();

  const newFriend = friendService.createFriend(createFriendDTO);
  response(res, StatusCodes.CREATED, '생성성공', newFriend);
}

/**
 *  @swagger
 *  /friends:
 *    get:
 *      summary: 친구 목록 조회
 *      description: 사용자의 친구 목록을 조회
 *      tags: [Friends]
 *      parameters:
 *        - in: query
 *          name: filterType
 *          required: false
 *          description: 필터 타입
 *          schema:
 *            type: string
 *        - in: query
 *          name: orderType
 *          required: false
 *          description: 정렬 타입 (asc/desc)
 *          schema:
 *            type: string
 *        - in: query
 *          name: orderBy
 *          required: false
 *          description: 정렬 기준 필드
 *          schema:
 *            type: string
 *        - in: query
 *          name: page
 *          required: false
 *          description: 페이지 번호
 *          schema:
 *            type: integer
 *        - in: query
 *          name: size
 *          required: false
 *          description: 페이지 당 항목 수
 *          schema:
 *            type: integer
 *      responses:
 *        200:
 *          description: 사용자의 전체 친구 목록
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                 statusCode:
 *                   type: number
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: 조회성공
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *              required:
 *                - statusCode
 *                - message
 *                - data
 */
router.get('/', getFriendList);
async function getFriendList(req, res) {
  const userId = req.user.id;

  // TODO: 필터 타입 추가
  const filterType = req.query.filterType;
  // TODO: 정렬 기준 추가
  const orderType = req.query.orderType;

  // 정렬기준
  const orderBy = req.query.orderBy;
  // 인덱싱용 페이지 - 어디서부터 보여줄지
  const page = req.query.page;
  // 보여줄 친구 수
  const size = req.query.size;

  const friendList = friendService.getFriendList(
    userId,
    filterType,
    orderType,
    orderBy,
    page,
    size
  );

  /* 
    # 데이터가 없는 경우   
      * 단일 리소스 조회 -> 404 Not Found
      * 컬렉션 리소스 조회 -> 200 OK, 빈 배열 반환
   */
  response(res, StatusCodes.OK, '조회성공', friendList);
}

/**
 * @swagger
 * /friends/{friendPkId}:
 *   get:
 *     summary: 특정 친구 조회
 *     tags:
 *       - Friends
 *     parameters:
 *       - in: path
 *         name: friendPkId
 *         schema:
 *           type: integer
 *         required: true
 *         description: 친구 PK ID
 *     responses:
 *       200:
 *          description: 친구 조회 완료
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                 statusCode:
 *                   type: number
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: 삭제성공
 *                 data:
 *                   type: object
 *                   description: 친구 정보
 *                   example: {}
 *              required:
 *                - statusCode
 *                - message
 *                - data

 */
router.get('/:friendPkId', getFriend);
async function getFriend(req, res) {
  const userId = req.user.id;
  const friendPkId = req.params.friendPkId;

  const friend = friendService.getFriend(userId, friendPkId);
  if (!friend) {
    throw new NotFoundError('친구를 찾을 수 없습니다.');
  }

  response(res, StatusCodes.OK, '조회성공', friend);
}

/**
 * @swagger
 * /friends:
 *   delete:
 *     summary: 친구 여러명(선택 or 모두) 삭제
 *     tags:
 *       - Friends
 *     parameters:
 *       - in: body
 *         name: friendPkIdList
 *         description: 삭제할 친구의 PK ID 목록
 *         schema:
 *           type: object
 *           properties:
 *             friendPkIdList:
 *               type: array
 *               items:
 *                 type: integer
 *     responses:
 *        200:
 *          description: 친구 삭제 완료
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                 statusCode:
 *                   type: number
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: 삭제성공
 *                 data:
 *                   type: object
 *                   description: 삭제 결과
 *                   example: {}
 *              required:
 *                - statusCode
 *                - message
 *                - data
 */
router.delete('/', deleteFriendList);
async function deleteFriendList(req, res) {
  const userId = req.user.id;
  const friendPkIdList = req.body.friendPkIdList;

  const result = friendService.deleteFriendList(userId, friendPkIdList);
  response(res, StatusCodes.OK, '삭제성공', result);
}

/**
 * @swagger
 * /friends/{friendPkId}:
 *   delete:
 *     summary: 특정 친구 삭제
 *     tags:
 *       - Friends
 *     parameters:
 *       - in: path
 *         name: friendPkId
 *         schema:
 *           type: integer
 *         required: true
 *         description: 친구 PK ID
 *     responses:
 *       200:
 *          description: 친구 삭제 완료
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                 statusCode:
 *                   type: number
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: 삭제성공
 *                 data:
 *                   type: object
 *                   description: 삭제 결과
 *                   example: {}
 *              required:
 *                - statusCode
 *                - message
 *                - data
 */
router.delete('/:friendPkId', deleteFriend);
async function deleteFriend(req, res) {
  const userId = req.user.id;
  const friendPkId = req.params.friendPkId;

  const result = friendService.deleteFriend(userId, friendPkId);
  response(res, StatusCodes.OK, '삭제성공', result);
}

module.exports = router;
