/**
 * battle-history-controller.js
 *  대결내역 관련 컨트롤러
 *
 * BASE URI: /battles/:id/histories
 */
const router = require('express').Router();
const { StatusCodes } = require('http-status-codes');

const response = require('@/common/response');
const { authMiddleware } = require('@/middleware/auth-handler');

const userService = require('@/services/user-service');
const battleService = require('@/services/battle-service');
const battleDetailService = require('@/services/battle-detail-service'); // battle-detail-service 추가

const { BizError } = require('@/error');
const CreateBattleHistoryDTO = require('@/types/dto/create-battle-history-dto');

// 인증 미들웨어를 모든 요청에 적용
router.use(authMiddleware);

router.post('/', createBattleHistory);
async function createBattleHistory(req, res) {
  const userId = req.user.id;
  const battleId = req.params.battleId;

  const createBattleHistoryDTO = CreateBattleHistoryDTO.fromPlainObject(
    req.body
  );
  createBattleHistoryDTO.userId = userId;
  createBattleHistoryDTO.battleId = battleId;
  createBattleHistoryDTO.validate();

  const battle = await battleService.getBattle(battleId);
  if (!battle) {
    throw new NotFoundError('대결을 찾을 수 없습니다.');
  }

  if (!battleDetailService.isEngagedInBattle(battleId, userId)) {
    throw new BizError(
      '대결에 참여하지 않은 사용자는 대결내역을 생성할 수 없습니다.'
    );
  }

  const newBattleHistory = await battleDetailService.createBattleHistory(
    createBattleHistoryDTO
  );
  response(res, StatusCodes.CREATED, '생성 성공', newBattleHistory);
}

router.get('/', getBattleHistoryList);
async function getBattleHistoryList(req, res) {
  const userId = req.user.id;
  const battleId = req.params.battleId;

  const battle = await battleService.getBattle(battleId);
  if (!battle) {
    throw new NotFoundError('대결을 찾을 수 없습니다.');
  }

  if (!battleDetailService.isEngagedInBattle(battleId, userId)) {
    throw new BizError(
      '대결에 참여하지 않은 사용자는 대결내역을 조회 할 수 없습니다.'
    );
  }

  const battleHistoryList = await battleDetailService.getBattleHistoryList(
    battleId
  );
  response(res, StatusCodes.OK, '조회 성공', battleHistoryList);
}

module.exports = router;
