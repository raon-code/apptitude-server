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
async function getFriendList(userId) {
  const friendList = await Friend.findAll({
    where: {
      userId
    },
    include: [
      {
        model: User
        // 필요한 User 속성을 명시적으로 지정합니다.
        // attributes: ['username']
      }
    ]
  });
  logger.debug(friendList);

  return friendList;
}

/**
 * 특정 친구 조회
 *
 * @param {number} friendId
 * @returns {Friend} 친구 정보
 */
async function getFriend(friendId) {
  const friend = await Friend.findByPk(friendId);
  logger.debug(friend);

  return friend;
}

/**
 * 선택한 or 전체 친구 삭제
 *
 * @param {number[]} friendIdList 친구 ID 목록
 * @returns {number} 삭제된 친구 수
 */
async function deleteFriendList(friendIdList) {
  const result = await Friend.destroy({
    where: {
      id: friendIdList
    }
  });
  logger.debug(result);

  return result;
}

/**
 * 특정 친구 삭제
 *
 * @param {number} friendId
 * @returns {number} 삭제된 친구 수
 */
async function deleteFriend(friendId) {
  const result = await Friend.destroy({
    where: {
      id: friendId
    }
  });
  logger.debug(result);

  return result;
}

module.exports = {
  createFriend,
  getFriendList,
  getFriend,
  deleteFriendList,
  deleteFriend
};
