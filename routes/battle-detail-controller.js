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

const { BizError } = require('@/error');

// 인증 미들웨어를 모든 요청에 적용
router.use((req, res, next) => {
  // 토큰확인
  authMiddleware(req, res, next);

  next();
});

// TODO: 배틀 상세 생성
router.post('/battles/:battleId/details', createBattleDetail);
async function createBattleDetail(req, res) {
  // TODO: createBattleDetailDTO 추가
  // TODO: createBattleDetail 서비스 추가: 배틀 상세 생성
}

// TODO: 배틀 상세 목록 조회
router.get('/battles/:battleId/details', getBattleDetailList);
async function getBattleDetailList(req, res) {
  // TODO: filter 필요
  //       상세를 어떻게 가져올 것인지?
  // TODO: getBattleDetailList 서비스 추가: 배틀 상세 목록 조회
}

// TODO: 배틀 상세 조회
router.get('/battles/:battleId/details/:detailId', getBattleDetail);
async function getBattleDetail(req, res) {
  // TODO: getBattleDetail 서비스 추가: 배틀 상세 조회
}

// TODO: 배틀 상세 수정
router.patch('/battles/:battleId/details/:detailId', updateBattleDetail);
async function updateBattleDetail(req, res) {
  // TODO: updateBattleDetail 서비스 추가: 배틀 상세 수정
}

module.exports = router;
