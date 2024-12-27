/**
 * battle-detail-controller.js
 *  대결상세 관련 컨트롤러
 *
 * BASE URI: /battles/:battleId/details
 */
const router = require('express').Router();
const { StatusCodes } = require('http-status-codes');

const response = require('@/common/response');
const { authMiddleware } = require('@/middleware/auth-handler');

const userService = require('@/services/user-service');
const battleService = require('@/services/battle-service');
const battleDetailService = require('@/services/battle-detail-service'); // battle-detail-service 추가
const CreateBattleDetailDTO = require('@/types/dto/create-battle-detail-dto'); // CreateBattleDetailDTO 추가

const { BizError } = require('@/error');
const UpdateBattleDetailDTO = require('@/types/dto/update-battle-detail-dto');

// 인증 미들웨어를 모든 요청에 적용
router.use(authMiddleware);

// 배틀 상세 생성
router.post('/', createBattleDetail);
async function createBattleDetail(req, res) {
  const userId = req.user.id;
  const battleId = req.params.battleId;

  const createBattleDetailDTO = CreateBattleDetailDTO.fromPlainObject(req.body);
  createBattleDetailDTO.userId = userId;
  createBattleDetailDTO.battleId = battleId;
  createBattleDetailDTO.validate();

  // TODO: 해당 배틀이 배틀 상세를 만들 수 있는 시점인지 확인 필요
  const battle = await battleService.getBattle(battleId);
  if (!battle) {
    // 배틀 상세 생성 불가
    throw new BizError('대결을 찾을 수 없습니다.');
  }
  if (!battleService.checkWaitForBattle(battle)) {
    // 배틀 상태상 배틀상세 생성 불가
    throw new BizError('대결상세를 만들 수 없는 상태 입니다.');
  }

  const newBattleDetail = await battleDetailService.createBattleDetail(
    createBattleDetailDTO
  );
  response(res, StatusCodes.CREATED, '생성 성공', newBattleDetail);
}

// 배틀 상세 목록 조회
router.get('/', getBattleDetailList);
async function getBattleDetailList(req, res) {
  const battleId = req.params.battleId;

  // 쿼리 파라미터를 사용해 필터링 옵션을 설정
  const { userId, statusType, detoxTime } = req.query;
  const filter = {
    battleId
  };

  // 필터 조건이 존재하면 추가
  if (userId) filter.userId = userId;
  if (statusType) filter.statusType = statusType;
  if (detoxTime) filter.detoxTime = detoxTime;

  // TODO: [피드백] 해당 배틀에 참가한 사용자인지 확인 필요
  if (!battleDetailService.isEngagedInBattle(req.user.id, battleId)) {
    throw new BizError('해당 배틀에 참가한 사용자가 아닙니다.');
  }

  const battleDetailList = await battleDetailService.getBattleDetailList(
    filter
  );
  response(res, StatusCodes.OK, '조회 성공', battleDetailList);
}

// 배틀 상세 조회
router.get('/:battleDetailId(\\d+)', getBattleDetail);
async function getBattleDetail(req, res) {
  const battleId = req.params.battleId;
  const battleDetailId = req.params.battleDetailId;

  // TODO: [피드백] 해당 배틀에 참가한 사용자인지 확인 필요
  if (!battleDetailService.isEngagedInBattle(req.user.id, battleId)) {
    throw new BizError('해당 배틀에 참가한 사용자가 아닙니다.');
  }

  const battleDetail = await battleDetailService.getBattleDetail(
    battleDetailId
  );

  if (!battleDetail) {
    throw new BizError('대결 상세를 찾을 수 없습니다.');
  }
  response(res, StatusCodes.OK, '조회 성공', battleDetail);
}

// 배틀 상세 수정
router.patch('/:battleDetailId(\\d+)', updateBattleDetail);
async function updateBattleDetail(req, res) {
  const battleDetailId = req.params.battleDetailId;

  // TODO: [피드백] 검증 후 조회하면 데이터베이스 리소스 조회를 줄일 수 있음
  // DTO 생성 및 검증 (수정 시에는 필요한 필드만 검증)
  const updateData = { ...req.body };

  // TODO: [피드백] updateBattleDetailDTO를 추가하여 사용해야 함
  //       업데이트 로직은 생성 로직과 다를 수 있으므로..
  const updateBattleDetailDTO =
    UpdateBattleDetailDTO.fromPlainObject(updateData);
  updateBattleDetailDTO.validate();

  const battleDetail = await battleDetailService.getBattleDetail(
    battleDetailId
  );
  if (!battleDetail) {
    throw new BizError('대결 상세를 찾을 수 없습니다.');
  }

  const updatedBattleDetail = await battleDetailService.updateBattleDetail(
    battleDetail,
    updateData
  );
  response(res, StatusCodes.OK, '수정 성공', updatedBattleDetail);
}

module.exports = router;
