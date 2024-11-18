/**
 * battle-detail-service.js
 *  대결상세 관련 서비스
 */
const BattleDetail = require('@/models/battle-detail');

const logger = require('@/config/logger');

const { BizError, UnauthorizeError } = require('@/error');
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
async function updateBattleDetail(battleDetailId, updateData) {
  // TODO: [피드백] 이미 컨트롤러 단에서 조회를 하였으므로, 또 조회할 필요가 없음
  const battleDetail = await getBattleDetail(battleDetailId);
  if (!battleDetail) {
    throw new BizError('대결 상세를 찾을 수 없습니다.');
  }

  updateProperties(battleDetail, updateData);
  await battleDetail.save();
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
  updateBattleDetail,
  isEngagedInBattle
};
