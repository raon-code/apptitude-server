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

const { BizError, NotFoundError } = require('@/error');

const CreateBattleDTO = require('@/types/dto/create-battle-dto');

// 인증 미들웨어를 모든 요청에 적용
router.use((req, res, next) => {
  // 토큰확인
  authMiddleware(req, res, next);

  next();
});

/**
 * @swagger
 * /battles:
 *   post:
 */
router.post('/', createBattle);
async function createBattle(req, res) {
  const userId = req.user.id;

  const createBattleDTO = CreateBattleDTO.fromPlainObject(req.body);
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

// TODO: 상대방 유저 대결 목록을 출력할때는 어떻게 보여줄 것인가?
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
  const userId = req.user.id;
  const battleList = await battleService.getBattleList(userId);

  response(res, StatusCodes.OK, '조회성공', battleList);
}

// TODO: 상대방 유저 대결 목록을 출력할때는 어떻게 보여줄 것인가?
router.get('/:battleId(+d\\)', getBattle);
async function getBattle(req, res) {
  const battleId = req.user.id;

  const battle = await battleService.getBattle(battleId);
  if (!battle) {
    throw new NotFoundError('대결을 찾을 수 없습니다.');
  }
  response(res, StatusCodes.OK, '조회성공', battle);
}

// TODO: 배틀 수정
router.patch('/:battleId(+d\\)', updateBattle);
async function updateBattle(req, res) {
  // TODO: updateBattle 서비스 추가: 배틀 수정
}

// TODO: 배틀 취소 및 종료
router.delete('/battles/:battleId(+d\\)', deleteBattle);
async function deleteBattle(req, res) {
  // TODO: checkBattleFinished 서비스 추가: 배틀 종료여부 체크
  // TODO: finishBattle 서비스 추가: 배틀 종료
  // TODO: cancelBattle 서비스 추가: 배틀 취소
}

module.exports = router;
