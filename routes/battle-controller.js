/**
 * battle-controller.js
 *  대결 관련 컨트롤러
 */
const router = require('express').Router();
const { StatusCodes } = require('http-status-codes');

const response = require('@/common/response');

const battleService = require('@/services/battle-service');

const CreateBattleDTO = require('@/types/dto/create-battle-dto');
const { BizError } = require('@/error');

router.post('/battles', createBattle);
async function createBattle(req, res) {
  const createBattleDTO = CreateBattleDTO.fromPlainObject(req.body);
  createBattleDTO.validate();

  const lastBattle = await battleService.getUserLastBattle(req.user.id);
  if (lastBattle) {
    // 대결 상태에 따라 생성 불가능한 경우
    const cannotCreateBattle =
      battleService.checkWaitForBattle(lastBattle) ||
      battleService.checkInBattle(lastBattle);

    if (cannotCreateBattle) {
      throw new BizError(
        '대결을 생성할 수 없습니다. 마지막 대결을 확인해주세요.'
      );
    }
  }

  const newBattle = await battleService.createBattle(createBattleDTO);
  response.success(res, StatusCodes.CREATED, newBattle);
}

// TODO: 배틀 조회
router.get('/battles/:id', getBattle);
async function getBattle(req, res) {
  // TODO: getBattle 서비스 추가: 배틀 조회
}

// TODO: 배틀 수정
router.patch('/battles/:id', updateBattle);
async function updateBattle(req, res) {
  // TODO: updateBattle 서비스 추가: 배틀 수정
}

// TODO: 배틀 취소 및 종료
router.delete('/battles/:id', deleteBattle);
async function deleteBattle(req, res) {
  // TODO: checkBattleFinished 서비스 추가: 배틀 종료여부 체크
  // TODO: finishBattle 서비스 추가: 배틀 종료
  // TODO: cancelBattle 서비스 추가: 배틀 취소
}

// TODO: 배틀 상세 생성
router.post('/battles/:id/details', createBattleDetail);
async function createBattleDetail(req, res) {
  // TODO: createBattleDetailDTO 추가
  // TODO: createBattleDetail 서비스 추가: 배틀 상세 생성
}

// TODO: 배틀 상세 목록 조회
router.get('/battles/:id/details', getBattleDetailList);
async function getBattleDetailList(req, res) {
  // TODO: filter 필요
  //       상세를 어떻게 가져올 것인지?
  // TODO: getBattleDetailList 서비스 추가: 배틀 상세 목록 조회
}

// TODO: 배틀 상세 조회
router.get('/battles/:id/details/:detailId', getBattleDetail);
async function getBattleDetail(req, res) {
  // TODO: getBattleDetail 서비스 추가: 배틀 상세 조회
}

// TODO: 배틀 상세 수정
router.patch('/battles/:id/details/:detailId', updateBattleDetail);
async function updateBattleDetail(req, res) {
  // TODO: updateBattleDetail 서비스 추가: 배틀 상세 수정
}

// TODO: 배틀 내역 생성
router.post('/battles/:id/histories', createBattleHistory);
async function createBattleHistory(req, res) {
  // TODO: createBattleHistoryDTO 추가
  // TODO: createBattleHistory 서비스 추가: 배틀 내역 생성
}

// TODO: 배틀 내역 목록 조회
router.get('/battles/:id/histories', getBattleHistoryList);
async function getBattleHistoryList(req, res) {
  // TODO: getBattleHistoryList 서비스 추가: 배틀 내역 목록 조회
}

// TODO: 초대링크 생성
router.post('/battles/:id/invitations', createInvitationURL);
async function createInvitationURL(req, res) {
  // TODO: createInvitationURL 서비스 추가: 초대링크 생성
  // updaoeBB
}

// TODO: 초대내역 조회
// TODO: createInvitationHistory 서비스 추가: 초대내역 생성
router.get('/battles/:id/invitations', getInvitationList);
async function getInvitationList(req, res) {
  // TODO: getInvitationList 서비스 추가: 초대내역 목록 조회
}

module.exports = router;
