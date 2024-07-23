/**
 * friend-service.js
 *  친구관련 서비스
 */
const User = require('@/models/user');
const Friend = require('@/models/friend');

const logger = require('@/config/logger');

const { BizError, UnauthorizeError } = require('@/error');
const { updateProperties } = require('@/common/object-util');

async function createFriend() {}

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
