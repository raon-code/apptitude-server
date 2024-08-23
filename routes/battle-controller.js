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

const userService = require('@/services/user-service');
const battleService = require('@/services/battle-service');
const battleDetailService = require('@/services/battle-detail-service');

const { BizError, NotFoundError } = require('@/error');

const CreateBattleDTO = require('@/types/dto/create-battle-dto');
const { updateProperties } = require('@/common/object-util');

// 인증 미들웨어를 모든 요청에 적용
router.use(authMiddleware);
/**
 * @swagger
 * /battles:
 *   post:
 *     summary: 대결 생성
 *     tags: [Battles]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - startDate
 *               - endDate
 *               - reward
 *               - userId
 *             properties:
 *               name:
 *                 type: string
 *                 description: 대결 이름
 *                 example: 대결이름
 *               startDate:
 *                 type: string
 *                 format: date
 *                 description: 대결 시작일자
 *                 example: 2024-01-01
 *               endDate:
 *                 type: string
 *                 format: date
 *                 description: 대결 종료일자
 *                 example: 2024-02-01
 *               reward:
 *                 type: string
 *                 description: 보상
 *                 example: 엽떡 사주기
 *               userId:
 *                 type: string
 *                 description: 사용자 ID
 *                 example: user123
 *     responses:
 *       201:
 *         description: 대결 생성 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: number
 *                   example: 201
 *                 message:
 *                   type: string
 *                   example: '생성성공'
 *                 data:
 *                   type: object
 *                   description: 생성한 대결 정보
 *               required:
 *                 - statusCode
 *                 - message
 *                 - data
 */
router.post('/', createBattle);
async function createBattle(req, res) {
  const userId = req.user.id;

  const createBattleDTO = CreateBattleDTO.fromPlainObject(req.body);
  createBattleDTO.userId = userId;
  createBattleDTO.validate();

  const lastBattle = await battleService.getUserLastBattle(userId);
  if (lastBattle) {
    // 대결 상태에 따라 생성 불가능한 경우
    const cannotCreateBattle =
      battleService.checkWaitForBattle(lastBattle) ||
      battleService.checkInBattle(lastBattle);

    if (cannotCreateBattle) {
      throw new BizError('대결을 생성할 수 없습니다. 대결내역을 확인해주세요.');
    }
  }

  const newBattle = await battleService.createBattle(createBattleDTO);
  response(res, StatusCodes.CREATED, '생성성공', newBattle);
}

/**
 * @swagger
 * /battles:
 *   get:
 *     summary: 대결 목록 조회
 *     tags:
 *       - Battles
 *     responses:
 *       200:
 *         description: 대결 목록 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Ok
 *                 data:
 *                   type: array
 *                   description: 대결 목록
 *                   items:
 *                     type: object
 *                     example: [{}]
 *               required:
 *                 - statusCode
 *                 - message
 *                 - data
 */
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
  const battleId = req.param.battleId;

  const isEngagedInBattle = battleDetailService.isEngagedInBattle(
    userId,
    battleId
  );
  if (!isEngagedInBattle) {
    throw new BizError('대결에 참여하지 않은 사용자입니다.');
  }

  const battle = await battleService.getBattle(battleId);
  if (!battle) {
    throw new NotFoundError('대결을 찾을 수 없습니다.');
  }
  response(res, StatusCodes.OK, '조회성공', battle);
}

// TODO: 배틀 수정
router.patch('/:battleId(\\d+)', updateBattle);
async function updateBattle(req, res) {
  const userId = req.user.id;
  const battleId = req.param.battleId;

  const isBattleLeader = battleService.isBattleLeader(userId, battleId);
  if (!isBattleLeader) {
    throw new BizError('대결 수정 권한이 없습니다.');
  }

  const battle = await battleService.getBattle(battleId);

  const updateBattleDTO = UpdateBattleDTO.fromPlainObject(req.body);
  const result = await updateProperties(battle, updateBattleDTO);

  response(res, StatusCodes.OK, '수정성공', result);
}

// TODO: 배틀 취소 및 종료
router.delete('/battles/:battleId(\\d+)', deleteBattle);
async function deleteBattle(req, res) {
  // TODO: checkBattleFinished 서비스 추가: 배틀 종료여부 체크
  // TODO: finishBattle 서비스 추가: 배틀 종료
  // TODO: cancelBattle 서비스 추가: 배틀 취소
}

module.exports = router;
