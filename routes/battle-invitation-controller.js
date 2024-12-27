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

const { BizError } = require('@/error');

const config = require('@/config');

// 인증 미들웨어를 모든 요청에 적용
router.use(authMiddleware);

router.post('/', createInvitationURL);
async function createInvitationURL(req, res) {
  const battleId = req.params.battleId;
  const userId = req.user.id;

  const battle = await battleService.getBattle(battleId);
  if (!battle) {
    throw new BizError('대결을 찾을 수 없습니다.');
  }

  const isBattleLeader = battleService.isBattleLeader(userId, battle);
  if (!isBattleLeader) {
    throw new BizError('초대 링크를 생성할 권한이 없습니다.');
  }

  // 초대링크 생성
  const inviteLink = battleService.createInviteLink(battleId);

  // 초대 관련된 정보 갱신 및 저장
  battle.inviteLink = inviteLink;
  battle.validWaitTime = config.apptitude.validWaitTime;
  await battle.save();

  const inviteUrl =
    config.server.baseUrl +
    `/battles/${battleId}/invitations/${encodeURIComponent(inviteLink)}`;
  response(res, StatusCodes.CREATED, { inviteUrl });
}

// TODO: 초대내역 조회
router.get('/:inviteLink', joinInvitation);
async function joinInvitation(req, res) {
  const inviteLink = req.params.inviteLink;
  const userId = req.user.id;

  response(res, StatusCodes.OK);
}

// // TODO: createInvitationHistory 서비스 추가: 초대내역 생성
// router.get('/', getInvitationList);
// async function getInvitationList(req, res) {
//   // TODO: getInvitationList 서비스 추가: 초대내역 목록 조회
// }

module.exports = router;
