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

const friendService = require('@/services/friend-service');
const CreateFriendDTO = require('@/types/dto/create-friend-dto');

// 인증 미들웨어를 모든 요청에 적용
router.use(authMiddleware);

router.post('/', createFriend);
async function createFriend(req, res) {
  const userId = req.user.id;
  const friendId = req.body.friendId;

  const createFriendDTO = CreateFriendDTO.fromPlainObject({ userId, friendId });
  createFriendDTO.validate();

  const newFriend = await friendService.createFriend(createFriendDTO);
  response(res, StatusCodes.CREATED, '생성성공', newFriend);
}

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

  const friendList = await friendService.getFriendList(
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

router.get('/:friendPkId(\\d+)', getFriend);
async function getFriend(req, res) {
  const friend = await friendService.getFriend(req.user.id, req.params.friendPkId);

  response(res, StatusCodes.OK, '조회성공', friend);
}

router.delete('/', deleteFriendList);
async function deleteFriendList(req, res) {
  const userId = req.user.id;
  const friendPkIdList = req.body.friendPkIdList;

  const result = await friendService.deleteFriendList(userId, friendPkIdList);
  response(res, StatusCodes.OK, '삭제성공', result);
}

router.delete('/:friendPkId(\\d+)', deleteFriend);
async function deleteFriend(req, res) {
  const result = await friendService.deleteFriendById(
    req.user.id,
    req.params.friendPkId
  );

  response(res, StatusCodes.OK, '삭제성공', result);
}

module.exports = router;
