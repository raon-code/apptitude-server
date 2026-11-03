/**
 * battle-detail-controller.js
 *  대결상세 관련 컨트롤러
 *
 * BASE URI: /battles/:battleId/details
 */
const router = require('express').Router({ mergeParams: true });
const { StatusCodes } = require('http-status-codes');

const response = require('@/common/response');
const { authMiddleware } = require('@/middleware/auth-handler');

const battleDetailService = require('@/services/battle-detail-service');
const CreateBattleDetailDTO = require('@/types/dto/create-battle-detail-dto');
const UpdateBattleDetailDTO = require('@/types/dto/update-battle-detail-dto');

// 인증 미들웨어를 모든 요청에 적용
router.use(authMiddleware);

// 배틀 상세 생성
router.post('/', createBattleDetail);
async function createBattleDetail(req, res) {
  const createBattleDetailDTO = CreateBattleDetailDTO.fromPlainObject(req.body);
  createBattleDetailDTO.userId = req.user.id;
  createBattleDetailDTO.battleId = Number(req.params.battleId);
  createBattleDetailDTO.validate();

  const newBattleDetail =
    await battleDetailService.createBattleDetailForUser(createBattleDetailDTO);
  response(res, StatusCodes.CREATED, '생성 성공', newBattleDetail);
}

// 배틀 상세 목록 조회
router.get('/', getBattleDetailList);
async function getBattleDetailList(req, res) {
  const battleId = req.params.battleId;

  // 쿼리 파라미터를 사용해 필터링 옵션을 설정
  const { userId, statusType, detoxTime } = req.query;
  const filter = {};

  // 필터 조건이 존재하면 추가
  if (userId) filter.userId = userId;
  if (statusType) filter.statusType = statusType;
  if (detoxTime) filter.detoxTime = detoxTime;

  const battleDetailList =
    await battleDetailService.getBattleDetailListForUser(
      battleId,
      req.user.id,
      filter
    );
  response(res, StatusCodes.OK, '조회 성공', battleDetailList);
}

// 배틀 상세 조회
router.get('/:battleDetailId(\\d+)', getBattleDetail);
async function getBattleDetail(req, res) {
  const battleDetail = await battleDetailService.getBattleDetailForUser(
    req.params.battleId,
    req.user.id,
    req.params.battleDetailId
  );
  response(res, StatusCodes.OK, '조회 성공', battleDetail);
}

// 배틀 상세 수정
router.patch('/:battleDetailId(\\d+)', updateBattleDetail);
async function updateBattleDetail(req, res) {
  const battleDetailId = req.params.battleDetailId;

  const updateBattleDetailDTO = UpdateBattleDetailDTO.fromPlainObject(req.body);
  updateBattleDetailDTO.validate();
  const updateData = Object.fromEntries(
    ['detoxTotalTime', 'detoxTime', 'resultType', 'statusType']
      .filter((field) => Object.hasOwn(req.body, field))
      .map((field) => [field, req.body[field]])
  );

  const updatedBattleDetail =
    await battleDetailService.updateBattleDetailById(
      battleDetailId,
      updateData
    );
  response(res, StatusCodes.OK, '수정 성공', updatedBattleDetail);
}

module.exports = router;
