/**
 * battle-service.js
 *  배틀관련 서비스
 */
const Battle = require('@/models/battle');

const logger = require('@/config/logger');

const { BizError, UnauthorizeError } = require('@/error');
const { updateProperties } = require('@/common/object-util');
const { STATUS_TYPE } = require('@/enum/status-type');

const battleDetailService = require('@/services/battle-detail-service');

const CreateBattleDTO = require('@/types/dto/create-battle-dto');
const BattleDetail = require('@/models/battle-detail');

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
    include: [
      {
        model: BattleDetail,
        as: 'battleDetail',
        where: {
          userId
        },
        attributes: [] // BattleDetail의 필드를 제외
      }
    ]
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
  logger.debug(battle);

  return battle;
}

async function getUserLastBattle(userId) {
  const battle = await Battle.findOne({
    where: {
      userId
    },
    order: [['createdAt', 'DESC']]
  });
  logger.debug(battle);

  return battle;
}

/**
 * 대결 정보 수정
 *
 * @param {Battle} battle
 * @param {UpdateBattleDTO} updateBattleDTO
 * @returns {Battle} 수정된 대결 정보
 */
async function updateBattle(battle, updateBattleDTO) {
  updateProperties(battle, updateBattleDTO);
  await battle.save();

  return battle;
}

/**
 * 대결 종료
 *
 * @param {battle} battle
 * @returns {Battle} 종료된 대결 정보
 */
async function finishBattle(battle) {
  battle.statusType = STATUS_TYPE.END.code;
  await battle.save();

  return battle;
}

/**
 * 대결 취소
 *
 * @param {Battle} battle
 * @returns {Battle} 취소된 대결 정보
 */
async function cancelBattle(battle) {
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
 * @returns
 */
function checkWaitForBattle(battle) {
  return battle.statusType === STATUS_TYPE.WAIT.code;
}

/**
 *
 * @param {Battle} battle
 */
function checkInBattle(battle) {
  return battle.statusType === STATUS_TYPE.PROCEED.code;
}

/**
 *
 * @param {*} battle
 * @returns
 */
function checkBattleFinished(battle) {
  return battle.endDate < new Date();
}

/**
 * 대결방장 여부 확인
 *
 * @param {number} userId 대결방장인지 확인할 사용자 ID
 * @param {Battle} battle 대결
 * @returns {boolean} 대결방장 여부
 */
async function isBattleLeader(userId, battle) {
  return battle.userId === userId;
}

module.exports = {
  createBattle,
  getBattleList,
  getBattle,
  getUserLastBattle,
  updateBattle,
  finishBattle,
  cancelBattle,
  createInvitationURL,
  getInvitationHistoryList,
  checkWaitForBattle,
  checkInBattle,
  checkBattleFinished,
  isBattleLeader
};
