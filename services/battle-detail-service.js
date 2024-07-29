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

async function isOwnUserBattle(userId, battleId) {
  // const battle = await getBattle(battleId);
  // if (!battle) {
  //   throw new BizError('대결이 존재하지 않습니다');
  // }
  // if (battle.userId !== userId) {
  //   throw new UnauthorizeError('해당 대결에 대한 권한이 없습니다');
  // }
}

module.exports = {
  createBattleDetail,
  getBattleDetailList,
  getBattleDetail,
  isOwnUserBattle
};
