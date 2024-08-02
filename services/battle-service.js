/**
 * battle-service.js
 *  배틀관련 서비스
 */
const Battle = require('@/models/battle');

const logger = require('@/config/logger');

const { BizError, UnauthorizeError } = require('@/error');
const { updateProperties } = require('@/common/object-util');
const { STATUS_TYPE } = require('@/enum/status-type');
const CreateBattleDTO = require('@/types/dto/create-battle-dto');

/**
 * 대결 생성
 *
 * @param {CreateBattleDTO} createBattleDTO
 * @returns {Battle} 새로 생성된 대결 정보
 */
async function createBattle(createBattleDTO) {
  const newBattle = await Battle.create(createBattleDTO);
  logger.debug(newBattle);

  return newBattle;
}

/**
 * 사용자의 대결 목록 조회
 *
 * @param {number} userId
 * @returns {Battle[]} 사용자의 대결 목록
 */
async function getBattleList(userId) {
  const battleList = await Battle.findAll({
    where: {
      userId
    }
  });
  logger.debug(battleList);

  return battleList;
}

/**
 * 대결 조회
 *
 * @param {number} battleId
 * @returns {Battle} 대결 정보
 */
async function getBattle(battleId) {
  const battle = await Battle.findByPk(battleId);
  if (!battle) {
    throw new BizError('대결이 존재하지 않습니다');
  }
  logger.debug(battle);

  return battle;
}

/**
 * 대결 정보 수정
 *
 * @param {number} battleId
 * @param {UpdateBattleDTO} updateBattleDTO
 * @returns {Battle} 수정된 대결 정보
 */
async function updateBattle(battleId, updateBattleDTO) {
  const battle = await getBattle(battleId);

  updateProperties(battle, updateBattleDTO);
  await battle.save();

  return battle;
}

/**
 * 대결 종료
 *
 * @param {number} battleId
 * @returns {Battle} 종료된 대결 정보
 */
async function finishBattle(battleId) {
  const battle = await Battle.findByPk(battleId);
  if (!battle) {
    throw new BizError('대결이 존재하지 않습니다');
  }

  battle.statusType = STATUS_TYPE.END.code;
  await battle.save();

  return battle;
}

/**
 * 대결 취소
 *
 * @param {number} battleId
 * @returns {Battle} 취소된 대결 정보
 */
async function cancelBattle(battleId) {
  const battle = await Battle.findByPk(battleId);
  if (!battle) {
    throw new BizError('대결이 존재하지 않습니다');
  }

  battle.statusType = STATUS_TYPE.CANCEL.code;
  await battle.save();

  return battle;
}

/**
 *
 */
async function createInvitationURL() {}

/**
 *
 */
async function getInvitationHistoryList() {}

/**
 *
 * @param {*} battle
 */
function checkInBattle(battle) {}

/**
 *
 * @param {*} battle
 * @returns
 */
function checkBattleFinished(battle) {
  return battle.endDate < new Date();
}

module.exports = {
  createBattle,
  getBattleList,
  getBattle,
  updateBattle,
  finishBattle,
  cancelBattle,
  createInvitationURL,
  getInvitationHistoryList,
  checkInBattle,
  checkBattleFinished
};
