/**
 * battle-detail-service.js
 *  대결상세 관련 서비스
 */
const BattleDetail = require('@/models/battle-detail');

const logger = require('@/config/logger');

const { BizError, UnauthorizeError } = require('@/error');
const { updateProperties } = require('@/common/object-util');

async function createBattleDetail() {}

async function getBattleDetailList(battleId) {
  const battleDetailList = await BattleDetail.findAll({
    where: {
      battleId
    }
  });
  logger.debug(battleDetailList);

  return battleDetailList;
}

async function getBattleDetail(battleDetailId) {
  const battleDetail = await BattleDetail.findByPk(battleDetailId);
  logger.debug(battleDetail);

  return battleDetail;
}

async function isEngagedInBattle(userId, battleId) {
  // battleId 에 해당하는 대결상세 조회
  const battleDetailList = await getBattleDetailList(battleId);
  // 배틀 중 userId 요소가 같은지 확인
  //   같으면 해당유저는 대결에 포함된 상태, 아니면 포함되지 않은 상태
  return battleDetailList.some(
    (battleDetail) => battleDetail.userId === userId
  );
}

module.exports = {
  createBattleDetail,
  getBattleDetailList,
  getBattleDetail,
  isEngagedInBattle
};
