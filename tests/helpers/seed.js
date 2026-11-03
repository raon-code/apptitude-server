/**
 * 테스트 시드/토큰 헬퍼
 */
const jwt = require('jsonwebtoken');

const server = require('@/server');
const config = require('@/config');
const User = require('@/models/user');
const Battle = require('@/models/battle');
const BattleDetail = require('@/models/battle-detail');
const { STATUS_TYPE } = require('@/enum/status-type');
const { RESULT_TYPE } = require('@/enum/result-type');

async function seedUsers(userIds) {
  for (const id of userIds) {
    await User.upsert({
      id,
      email: `user${id}@test.local`,
      nickname: `user${id}`
    });
  }
}

async function seedBattle({ userId, battleId, statusType }) {
  await Battle.upsert({
    id: battleId,
    name: `테스트 대결 ${battleId}`,
    startDate: new Date(),
    endDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
    reward: '커피',
    isRewardPaid: false,
    statusType: statusType || STATUS_TYPE.PROCEED.code,
    userId
  });

  await BattleDetail.upsert({
    id: battleId,
    detoxTotalTime: 60,
    detoxTime: 10,
    resultType: RESULT_TYPE.PROCEED.code,
    userId,
    battleId
  });
}

function tokenFor(userId) {
  return jwt.sign({ id: userId }, config.jwt.secret, { expiresIn: '1h' });
}

module.exports = { server, seedUsers, seedBattle, tokenFor };
