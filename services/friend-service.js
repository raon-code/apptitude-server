/**
 * friend-service.js
 *  친구관련 서비스
 */
const User = require('@/models/user');
const Friend = require('@/models/friend');

const logger = require('@/config/logger');

const { BizError, UnauthorizeError } = require('@/error');
const { updateProperties } = require('@/common/object-util');

const CreateFriendDTO = require('@/types/dto/create-friend-dto');

/**
 * 친구 생성
 *
 * @param {CreateFriendDTO} createFriendDTO 친구 생성 DTO
 * @returns {Friend} 새로 추가된 친구 정보
 */
async function createFriend(createFriendDTO) {
  const newFriend = await Friend.create(createFriendDTO);
  logger.debug(newFriend);

  return newFriend;
}

/**
 * 사용자 친구 목록 조회
 *
 * @param {number} userId
 * @returns {object[]} 친구 목록
 */
async function getFriendList(
  userId,
  filterType,
  orderType,
  orderBy,
  page,
  size
) {
  // 기본값
  const defaultPage = 1;
  const defaultSize = 10;

  // 페이지, 사이즈 값 설정
  const currentPage = page || defaultPage;
  const pageSize = size || defaultSize;
  const offset = (currentPage - 1) * pageSize;

  // 정렬 옵션 설정
  const order = [];
  if (orderBy) {
    const direction = orderType === 'DESC' ? 'DESC' : 'ASC';
    order.push([orderBy, direction]);
  }

  // 필터 옵션 설정
  const where = { userId };
  if (filterType) {
    // 여기에 추가적인 필터 조건을 설정할 수 있습니다.
    // 예를 들어, 친구 상태에 따른 필터링 등.
    //where.status = filterType; // 예: 'active', 'pending' 등
  }

  const friendList = await Friend.findAll({
    where,
    include: [
      {
        model: User,
        as: 'friend'
        // 필요한 User 속성을 명시적으로 지정합니다.
        // attributes: ['username']
      }
    ],
    order,
    limit: pageSize,
    offset
  });
  logger.debug(friendList);

  return friendList;
}

/**
 * 특정 친구 조회
 *
 * @param {number} friendPkId
 * @returns {Friend} 친구 정보
 */
async function getFriend(userId, friendPkId) {
  const friend = await Friend.findByPk(friendPkId, {
    include: [
      {
        model: User,
        as: 'friend'
      }
    ]
  });
  logger.debug(friend);

  verifyUserFriend(friend, userId);

  return friend;
}

/**
 * 선택한 or 전체 친구 삭제
 *
 * @param {number[]} friendPkIdList 친구 ID 목록
 * @returns {number} 삭제된 친구 수
 */
async function deleteFriendList(userId, friendPkIdList) {
  const friendList = await Friend.findAll({
    where: {
      id: friendPkIdList
    }
  });
  logger.debug(friendList);

  friendList.forEach((friend) => {
    verifyUserFriend(friend, userId);
  });

  const result = await Friend.destroy({
    where: {
      id: friendPkIdList
    }
  });
  logger.debug(result);

  return result;
}

/**
 * 특정 친구 삭제
 *
 * @param {number} friendPkId
 * @returns {number} 삭제된 친구 수
 */
async function deleteFriend(userId, friendPkId) {
  const friend = await Friend.findByPk(friendPkId);
  logger.debug(friend);

  verifyUserFriend(friend, userId);

  const result = await Friend.destroy({
    where: {
      id: friendPkId
    }
  });
  logger.debug(result);

  return result;
}

/**
 * 사용자 친구인지 검증
 */
function verifyUserFriend(friend, userId) {
  if (!friend) {
    throw new BizError('친구 정보를 찾을 수 없습니다.');
  }
  if (friend.userId !== userId) {
    throw new UnauthorizeError('친구 정보에 접근할 수 없습니다.');
  }
}

module.exports = {
  createFriend,
  getFriendList,
  getFriend,
  deleteFriendList,
  deleteFriend
};
