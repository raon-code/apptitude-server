/**
 * battle-service.js
 *  배틀관련 서비스
 */
const Battle = require('@/models/battle');

const logger = require('@/config/logger');

const { BizError, UnauthorizeError } = require('@/error');
const { updateProperties } = require('@/common/object-util');
const { STATUS_TYPE } = require('@/enum/status-type');

/**
 *
 * @param {*} createBattleDTO
 * @returns
 */
async function createBattle(createBattleDTO) {
  const newBattle = await Battle.create(createBattleDTO);
  logger.debug(newBattle);

  return newBattle;
}

/**
 *
 * @param {*} userId
 * @returns
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
 *
 * @param {*} battleId
 * @returns
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
 *
 * @param {*} battleId
 * @param {*} updateBattleDTO
 * @returns
 */
async function updateBattle(battleId, updateBattleDTO) {
  const battle = await getBattle(battleId);

  updateProperties(battle, updateBattleDTO);
  await battle.save();

  return battle;
}

/**
 *
 * @async
 * @param {*} battleId
 * @returns {unknown}
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
 *
 * @param {*} battleId
 * @returns
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
