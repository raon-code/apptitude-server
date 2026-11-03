/**
 * battle-history-controller.js
 *  대결내역 관련 컨트롤러
 *
 * BASE URI: /battles/:id/histories
 */
const router = require('express').Router({ mergeParams: true });
const { StatusCodes } = require('http-status-codes');

const response = require('@/common/response');
const { authMiddleware } = require('@/middleware/auth-handler');

const battleService = require('@/services/battle-service');
const CreateBattleHistoryDTO = require('@/types/dto/create-battle-history-dto');

// 인증 미들웨어를 모든 요청에 적용
router.use(authMiddleware);

router.post('/', createBattleHistory);
async function createBattleHistory(req, res) {
  const userId = req.user.id;

  const createBattleHistoryDTO = CreateBattleHistoryDTO.fromPlainObject(
    req.body
  );
  createBattleHistoryDTO.userId = userId;
  createBattleHistoryDTO.battleId = req.params.battleId;
  createBattleHistoryDTO.validate();

  const newBattleHistory = await battleService.createBattleHistoryForUser(
    createBattleHistoryDTO,
    userId
  );
  response(res, StatusCodes.CREATED, '생성 성공', newBattleHistory);
}

router.get('/', getBattleHistoryList);
async function getBattleHistoryList(req, res) {
  const userId = req.user.id;
  const battleId = req.params.battleId;

  const battleHistoryList = await battleService.getBattleHistoryListForUser(
    battleId,
    userId
  );
  response(res, StatusCodes.OK, '조회 성공', battleHistoryList);
}

module.exports = router;
