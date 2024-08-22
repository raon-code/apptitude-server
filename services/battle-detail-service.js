/**
 * battle-detail-service.js
 *  대결상세 관련 서비스
 */
const BattleDetail = require('@/models/battle-detail');

const logger = require('@/config/logger');

const { BizError, UnauthorizeError } = require('@/error');
const { updateProperties } = require('@/common/object-util');

async function createBattleDetail() {}

async function getBattleDetailList() {}

async function getBattleDetail() {}

async function isEngagedInBattle(userId, battleId) {
  // battleId 에 해당하는 대결상세 조회
  // 배틀 중 userId 요소가 같은지 확인
  // 같으면 true, 아니면 false
}

module.exports = {
  createBattleDetail,
  getBattleDetailList,
  getBattleDetail,
  isEngagedInBattle
};
