const router = require('express').Router();
const { StatusCodes } = require('http-status-codes');

const userService = require('@/services/user-service');
const response = require('@/common/response');

// TODO: 배틀 만들기
router.post('/battles', createBattle);

// TODO: 배틀 조회
router.get('/battles/:id', getBattle);

// TODO: 배틀 수정
router.patch('/battles/:id', updateBattle);

// TODO: 배틀 취소 및 종료
router.delete('/battles/:id', deleteBattle);

// TODO: 배틀 상세 생성
router.post('/battles/:id/details', createBattleDetail);

// TODO: 배틀 상세 목록 조회
router.get('/battles/:id/details', getBattleDetailList);

// TODO: 배틀 상세 조회
router.get('/battles/:id/details/:detailId', getBattleDetail);

// TODO: 배틀 상세 수정
router.patch('/battles/:id/details/:detailId', updateBattleDetail);

// TODO: 배틀 내역 생성
router.post('/battles/:id/histories', createBattleHistory);

// TODO: 배틀 내역 목록 조회
router.get('/battles/:id/histories', getBattleHistoryList);

// TODO: 초대링크 생성
router.post('/battles/:id/invitations', createInvitationURL);

// TODO: 초대내역 조회
router.get('/battles/:id/invitations', getInvitationList);


module.exports = router;
