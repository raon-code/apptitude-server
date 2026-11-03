/**
 * battle-detail-service.js
 *  대결상세 관련 서비스
 */
const BattleDetail = require('@/models/battle-detail');
const Battle = require('@/models/battle');

const logger = require('@/config/logger');

const { BizError, UnauthorizeError, NotFoundError } = require('@/error');
const { updateProperties } = require('@/common/object-util');
const { STATUS_TYPE } = require('@/enum/status-type');
const CreateBattleDetailDTO = require('@/types/dto/create-battle-detail-dto');

/**
 * 대결 상세 생성
 *
 * @param {CreateBattleDetailDTO} createBattleDetailDTO
 * @returns {BattleDetail} 새로 생성된 대결 정보
 */
async function createBattleDetail(createBattleDetailDTO) {
  const newBattleDetail = await BattleDetail.create(createBattleDetailDTO);
  logger.debug(newBattleDetail);

  return newBattleDetail;
}

/**
 * 사용자의 대결 상세 목록 조회
 *
 * @param {Object} filter - 필터링 조건을 담은 객체
 * @returns {BattleDetail[]} 사용자의 대결 상세 목록
 */
// TODO: [피드백] 이미 사용중이었던 getBattleDetailList 함수가 있으므로
//       새로운 함수를 만들거나, 기존 함수에 맞추어 비즈니스 로직을 수정해야 함
async function getBattleDetailList(filter) {
  // 기본적으로 battleId에 대한 필터를 적용
  const whereClause = {
    battleId: filter.battleId
  };

  // 추가적인 필터 조건이 있으면 where 절에 포함
  if (filter.userId) whereClause.userId = filter.userId;
  if (filter.statusType) whereClause.statusType = filter.statusType;
  if (filter.detoxTime) whereClause.detoxTime = filter.detoxTime;

  const battleDetailList = await BattleDetail.findAll({
    where: whereClause
  });
  logger.debug(battleDetailList);

  return battleDetailList;
}

/**
 * 대결 상세 조회
 *
 * @param {number} battleDetailId
 * @returns {BattleDetail} 대결 상세 정보
 */
async function getBattleDetail(battleDetailId) {
  const battleDetail = await BattleDetail.findByPk(battleDetailId);
  logger.debug(battleDetail);

  return battleDetail;
}

/**
 * 대결 상세 수정
 *
 * @param {number} battleDetailId
 * @param {Object} updateData
 * @returns {BattleDetail} 수정된 대결 상세 정보
 */
async function updateBattleDetail(battleDetail, updateData) {
  updateProperties(battleDetail, updateData);
  await battleDetail.save();
  logger.debug(battleDetail);

  return battleDetail;
}

async function isEngagedInBattle(userId, battleId) {
  // battleId 에 해당하는 대결상세 조회
  const battleDetailList = await getBattleDetailList({ battleId });
  // 배틀 중 userId 요소가 같은지 확인
  //   같으면 해당유저는 대결에 포함된 상태, 아니면 포함되지 않은 상태
  return battleDetailList.some(
    (battleDetail) => battleDetail.userId === userId
  );
}

/**
 * 대결 상태 검증을 포함한 대결상세 생성
 *
 * @param {CreateBattleDetailDTO} createBattleDetailDTO
 * @returns {BattleDetail} 생성된 대결상세
 */
async function createBattleDetailForUser(createBattleDetailDTO) {
  const battle = await Battle.findByPk(createBattleDetailDTO.battleId);
  if (!battle) {
    throw new NotFoundError('대결을 찾을 수 없습니다.');
  }

  if (battle.statusType !== STATUS_TYPE.WAIT.code) {
    throw new BizError('대결상세를 만들 수 없는 상태 입니다.');
  }

  return createBattleDetail(createBattleDetailDTO);
}

/**
 * 참여자 검증을 포함한 대결상세 목록 조회
 *
 * @param {number} battleId
 * @param {number} userId
 * @param {Object} filter
 * @returns {BattleDetail[]} 대결상세 목록
 */
async function getBattleDetailListForUser(battleId, userId, filter) {
  if (!(await isEngagedInBattle(userId, battleId))) {
    throw new BizError('해당 배틀에 참가한 사용자가 아닙니다.');
  }

  return getBattleDetailList(filter);
}

/**
 * 참여자 검증을 포함한 대결상세 조회
 *
 * @param {number} battleId
 * @param {number} userId
 * @param {number} battleDetailId
 * @returns {BattleDetail} 대결상세
 */
async function getBattleDetailForUser(battleId, userId, battleDetailId) {
  if (!(await isEngagedInBattle(userId, battleId))) {
    throw new BizError('해당 배틀에 참가한 사용자가 아닙니다.');
  }

  const battleDetail = await getBattleDetail(battleDetailId);
  if (!battleDetail) {
    throw new NotFoundError('대결 상세를 찾을 수 없습니다.');
  }

  return battleDetail;
}

/**
 * 존재 검증을 포함한 대결상세 수정
 *
 * @param {number} battleDetailId
 * @param {Object} updateData
 * @returns {BattleDetail} 수정된 대결상세
 */
async function updateBattleDetailForUser(battleDetailId, updateData) {
  const battleDetail = await getBattleDetail(battleDetailId);
  if (!battleDetail) {
    throw new NotFoundError('대결 상세를 찾을 수 없습니다.');
  }

  return updateBattleDetail(battleDetail, updateData);
}

module.exports = {
  createBattleDetail,
  getBattleDetailList,
  getBattleDetail,
  updateBattleDetail,
  isEngagedInBattle,
  createBattleDetailForUser,
  getBattleDetailListForUser,
  getBattleDetailForUser,
  updateBattleDetailForUser
};
