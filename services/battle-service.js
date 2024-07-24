/**
 * battle-service.js
 *  배틀관련 서비스
 */
const Battle = require('@/models/battle');

const logger = require('@/config/logger');

const { BizError, UnauthorizeError } = require('@/error');
const { updateProperties } = require('@/common/object-util');
const { STATUS_TYPE } = require('@/enum/status-type');

async function createBattle(createBattleDTO) {
  const newBattle = await Battle.create(createBattleDTO);
  logger.debug(battle);

  return newBattle;
}

async function getBattleList(userId) {
  const battleList = await Battle.findAll({
    where: {
      userId
    }
  });
  logger.debug(battleList);

  return battleList;
}

async function getBattle(battleId) {
  const battle = await Battle.findByPk(battleId);
  logger.debug(battle);

  return battle;
}

function isOwnUserBattle() {}

function checkBattleFinished() {}

async function updateBattle(battleId, updateBattleDTO) {
  const battle = await Battle.findByPk(battleId);
  if (!battle) {
    throw new BizError('대결이 존재하지 않습니다');
  }

  updateProperties(battle, updateBattleDTO);
  await battle.save();

  return battle;
}

async function finishBattle(battleId) {
  const battle = await Battle.findByPk(battleId);
  if (!battle) {
    throw new BizError('대결이 존재하지 않습니다');
  }

  battle.statusType = STATUS_TYPE.END.code;
  await battle.save();

  return battle;
}

async function cancelBattle(battleId) {
  const battle = await Battle.findByPk(battleId);
  if (!battle) {
    throw new BizError('대결이 존재하지 않습니다');
  }

  battle.statusType = STATUS_TYPE.CANCEL.code;
  await battle.save();

  return battle;
}

async function createInvitationURL() {}

async function getInvitationHistoryList() {}

module.exports = {
  createBattle,
  getBattleList,
  getBattle,
  isOwnUserBattle,
  checkBattleFinished,
  updateBattle,
  finishBattle,
  cancelBattle,
  createInvitationURL,
  getInvitationHistoryList
};
