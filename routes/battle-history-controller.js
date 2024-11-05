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
router.use(authMiddleware);

// TODO: 배틀 내역 생성
router.post('/', createBattleHistory);
async function createBattleHistory(req, res) {
  // TODO: createBattleHistoryDTO 추가
  // TODO: createBattleHistory 서비스 추가: 배틀 내역 생성
}

// TODO: 배틀 내역 목록 조회
router.get('/', getBattleHistoryList);
async function getBattleHistoryList(req, res) {
  // TODO: getBattleHistoryList 서비스 추가: 배틀 내역 목록 조회
}

module.exports = router;
