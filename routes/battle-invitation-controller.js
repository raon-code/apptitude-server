/**
 * battle-invitation-controller.js
 *  대결 초대 관련 컨트롤러
 *
 * BASE URI: /battles/:id/invitations
 */
const router = require('express').Router({ mergeParams: true });
const { StatusCodes } = require('http-status-codes');

const response = require('@/common/response');
const { authMiddleware } = require('@/middleware/auth-handler');

const battleService = require('@/services/battle-service');

// 인증 미들웨어를 모든 요청에 적용
router.use(authMiddleware);

router.post('/', createInvitationURL);
async function createInvitationURL(req, res) {
  const inviteUrl = await battleService.createInvitationUrl(
    req.params.battleId,
    req.user.id
  );

  response(res, StatusCodes.CREATED, '생성 성공', { inviteUrl });
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
