/**
 * friend-service.js
 *  친구관련 서비스
 */
const User = require('@/models/user');
const Friend = require('@/models/friend');

const logger = require('@/config/logger');

const { BizError, UnauthorizeError } = require('@/error');
const { updateProperties } = require('@/common/object-util');

/**
 * 친구 생성
 * @param {string} userId 사용자 ID
 * @param {string} friendId 친구 ID(추가할 사용자 ID)
 * @returns {Friend} 새로 추가된 친구 정보
 */
async function createFriend(userId, friendId) {}

async function getFriendList() {}

async function getFriend() {}

async function deleteFriendList() {}

async function deleteFriend() {}

module.exports = {
  createFriend,
  getFriendList,
  getFriend,
  deleteFriendList,
  deleteFriend
};
