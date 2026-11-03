/**
 * battle-service.js
 *  배틀관련 서비스
 */
const Battle = require('@/models/battle');
const BattleHistory = require('@/models/battle-history');

const config = require('@/config');
const logger = require('@/config/logger');
const { BizError, NotFoundError } = require('@/error');
const battleDetailService = require('@/services/battle-detail-service');

const { updateProperties } = require('@/common/object-util');
const { STATUS_TYPE } = require('@/enum/status-type');

const CreateBattleDTO = require('@/types/dto/create-battle-dto');
const BattleDetail = require('@/models/battle-detail');
const CreateBattleHistoryDTO = require('@/types/dto/create-battle-history-dto');

const { encrypt } = require('@/common/crypto');
const { getRandomFloat } = require('@/common/math');

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
 * 대결 히스토리 생성
 *
 * @param {CreateBattleHistoryDTO} createBattleHistoryDTO 대결 히스토리 생성 DTO
 * @returns {BattleHistory} 새로 생성된 대결 히스토리
 */
async function createBattleHistory(createBattleHistoryDTO) {
  const newBattleHistory = await BattleHistory.create(createBattleHistoryDTO);
  logger.debug(newBattleHistory);

  return newBattleHistory;
}

/**
 * 대결 히스토리 목록 조회
 *
 * @param {number} battleId 조회할 내역의 대결 ID
 * @returns {BattleHistory[]} 대결 히스토리 목록
 */
async function getBattleHistoryList(battleId) {
  const battleHistoryList = await BattleHistory.findAll({
    where: {
      battleId
    }
  });
  logger.debug(battleHistoryList);

  return battleHistoryList;
}

async function createInviteLink(battleId) {
  const randomNumber = getRandomFloat(1000, 10000);
  const encryptData = encrypt(`${battleId}:${randomNumber}`);
  return encryptData;
}

async function getInvitationList() {}

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

/**
 * 사용자의 대결 생성 (생성 가능 상태 검증 포함)
 *
 * @param {CreateBattleDTO} createBattleDTO
 * @returns {Battle} 생성된 대결
 */
async function createBattleForUser(createBattleDTO) {
  const lastBattle = await getUserLastBattle(createBattleDTO.userId);
  if (
    lastBattle &&
    (checkWaitForBattle(lastBattle) || checkInBattle(lastBattle))
  ) {
    throw new BizError('대결을 생성할 수 없습니다. 대결내역을 확인해주세요.');
  }

  return createBattle(createBattleDTO);
}

/**
 * 참여자 검증을 포함한 대결 조회
 *
 * @param {number} battleId
 * @param {number} userId
 * @returns {Battle} 대결
 */
async function getBattleForUser(battleId, userId) {
  const battle = await getBattle(battleId);
  if (!battle) {
    throw new NotFoundError('대결을 찾을 수 없습니다.');
  }

  const isEngaged = await battleDetailService.isEngagedInBattle(
    userId,
    battleId
  );
  if (!isEngaged) {
    throw new BizError('대결에 참여하지 않은 사용자입니다.');
  }

  return battle;
}

/**
 * 방장 검증을 포함한 대결 수정
 *
 * @param {number} battleId
 * @param {number} userId
 * @param {UpdateBattleDTO} updateBattleDTO
 * @returns {Battle} 수정된 대결
 */
async function updateBattleForUser(battleId, userId, updateBattleDTO) {
  const battle = await getBattle(battleId);
  if (!battle) {
    throw new NotFoundError('대결을 찾을 수 없습니다.');
  }

  const isLeader = await isBattleLeader(userId, battle);
  if (!isLeader) {
    throw new BizError('대결 수정 권한이 없습니다.');
  }

  return updateBattle(battle, updateBattleDTO);
}

/**
 * 참여자 검증을 포함한 대결 삭제(취소/종료)
 *
 * @param {number} battleId
 * @param {number} userId
 * @param {boolean} isCancel 취소 여부
 * @returns {Battle} 변경된 대결
 */
async function deleteBattleForUser(battleId, userId, isCancel) {
  const battle = await getBattle(battleId);
  if (!battle) {
    throw new NotFoundError('대결을 찾을 수 없습니다.');
  }

  const isEngaged = await battleDetailService.isEngagedInBattle(
    userId,
    battleId
  );
  if (!isEngaged) {
    throw new BizError('대결에 참여하지 않은 사용자입니다.');
  }

  if (checkBattleFinished(battle)) {
    throw new BizError('이미 종료된 대결입니다.');
  }

  return isCancel ? cancelBattle(battle) : finishBattle(battle);
}

/**
 * 참여자 검증을 포함한 대결내역 생성
 *
 * @param {CreateBattleHistoryDTO} createBattleHistoryDTO
 * @param {number} userId
 * @returns {BattleHistory} 생성된 대결내역
 */
async function createBattleHistoryForUser(createBattleHistoryDTO, userId) {
  const battleId = createBattleHistoryDTO.battleId;

  const battle = await getBattle(battleId);
  if (!battle) {
    throw new NotFoundError('대결을 찾을 수 없습니다.');
  }

  const isEngaged = await battleDetailService.isEngagedInBattle(
    userId,
    battleId
  );
  if (!isEngaged) {
    throw new BizError(
      '대결에 참여하지 않은 사용자는 대결내역을 생성할 수 없습니다.'
    );
  }

  createBattleHistoryDTO.userId = userId;
  return createBattleHistory(createBattleHistoryDTO);
}

/**
 * 참여자 검증을 포함한 대결내역 목록 조회
 *
 * @param {number} battleId
 * @param {number} userId
 * @returns {BattleHistory[]} 대결내역 목록
 */
async function getBattleHistoryListForUser(battleId, userId) {
  const battle = await getBattle(battleId);
  if (!battle) {
    throw new NotFoundError('대결을 찾을 수 없습니다.');
  }

  const isEngaged = await battleDetailService.isEngagedInBattle(
    userId,
    battleId
  );
  if (!isEngaged) {
    throw new BizError(
      '대결에 참여하지 않은 사용자는 대결내역을 조회 할 수 없습니다.'
    );
  }

  return getBattleHistoryList(battleId);
}

/**
 * 방장 검증을 포함한 초대 링크 생성
 *
 * @param {number} battleId
 * @param {number} userId
 * @returns {string} 초대 URL
 */
async function createInvitationUrl(battleId, userId) {
  const battle = await getBattle(battleId);
  if (!battle) {
    throw new NotFoundError('대결을 찾을 수 없습니다.');
  }

  const isLeader = await isBattleLeader(userId, battle);
  if (!isLeader) {
    throw new BizError('초대 링크를 생성할 권한이 없습니다.');
  }

  const inviteLink = await createInviteLink(battleId);
  battle.inviteLink = inviteLink;
  battle.validWaitTime = config.apptitude.validWaitTime;
  await battle.save();

  return (
    config.server.baseUrl +
    `/battles/${battleId}/invitations/${encodeURIComponent(inviteLink)}`
  );
}

module.exports = {
  createBattle,
  getBattleList,
  getBattle,
  getUserLastBattle,
  updateBattle,
  finishBattle,
  cancelBattle,
  createBattleHistory,
  getBattleHistoryList,
  createInviteLink,
  getInvitationList,
  checkWaitForBattle,
  checkInBattle,
  checkBattleFinished,
  isBattleLeader,
  createBattleForUser,
  getBattleForUser,
  updateBattleForUser,
  deleteBattleForUser,
  createBattleHistoryForUser,
  getBattleHistoryListForUser,
  createInvitationUrl
};
