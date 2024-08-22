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

// 인증 미들웨어를 모든 요청에 적용
router.use((req, res, next) => {
  // 토큰확인
  authMiddleware(req, res, next);

  next();
});

// TODO: 초대링크 생성
router.post('/', createInvitationURL);
async function createInvitationURL(req, res) {
  // TODO: createInvitationURL 서비스 추가: 초대링크 생성
  // updaoeBB
}

// TODO: 초대내역 조회
// TODO: createInvitationHistory 서비스 추가: 초대내역 생성
router.get('/', getInvitationList);
async function getInvitationList(req, res) {
  // TODO: getInvitationList 서비스 추가: 초대내역 목록 조회
}

module.exports = router;
