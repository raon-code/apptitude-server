/**
 * battle-controller.js
 *  대결 관련 컨트롤러
 *
 * BASE URI: /battles
 */
const router = require('express').Router();
const { StatusCodes } = require('http-status-codes');

const response = require('@/common/response');
const { authMiddleware } = require('@/middleware/auth-handler');

const battleService = require('@/services/battle-service');

const CreateBattleDTO = require('@/types/dto/create-battle-dto');
const UpdateBattleDTO = require('@/types/dto/update-battle-dto');

// 인증 미들웨어를 모든 요청에 적용
router.use(authMiddleware);

router.post('/', createBattle);
async function createBattle(req, res) {
  const createBattleDTO = CreateBattleDTO.fromPlainObject(req.body);
  createBattleDTO.userId = req.user.id;
  createBattleDTO.validate();

  const newBattle = await battleService.createBattleForUser(createBattleDTO);
  response(res, StatusCodes.CREATED, '생성성공', newBattle);
}

router.get('/', getBattleList);
async function getBattleList(req, res) {
  // TODO: 페이징 필요한가?

  const userId = req.user.id;
  const battleList = await battleService.getBattleList(userId);

  response(res, StatusCodes.OK, '조회성공', battleList);
}

router.get('/:battleId(\\d+)', getBattle);
async function getBattle(req, res) {
  const userId = req.user.id;
  const battleId = req.params.battleId;

  const battle = await battleService.getBattleForUser(battleId, userId);
  response(res, StatusCodes.OK, '조회성공', battle);
}

// TODO: 배틀 수정

router.patch('/:battleId(\\d+)', updateBattle);
async function updateBattle(req, res) {
  const userId = req.user.id;
  const battleId = req.params.battleId;
  const updateBattleDTO = UpdateBattleDTO.fromPlainObject(req.body);
  updateBattleDTO.validate();

  const result = await battleService.updateBattleForUser(
    battleId,
    userId,
    updateBattleDTO
  );
  response(res, StatusCodes.OK, '수정성공', result);
}

router.delete('/:battleId(\\d+)', deleteBattle);
async function deleteBattle(req, res) {
  const battleId = req.params.battleId;
  const userId = req.user.id;
  const { isCancel } = req.query;

  const result = await battleService.deleteBattleForUser(
    battleId,
    userId,
    isCancel
  );
  response(res, StatusCodes.OK, '삭제성공', result);
}

module.exports = router;
