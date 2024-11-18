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
const battleDetailService = require('@/services/battle-detail-service'); // battle-detail-service 추가
const CreateBattleDetailDTO = require('@/types/dto/create-battle-detail-dto'); // CreateBattleDetailDTO 추가

const { BizError } = require('@/error');

// 인증 미들웨어를 모든 요청에 적용
router.use(authMiddleware);

// 배틀 상세 생성
router.post('/', createBattleDetail);
async function createBattleDetail(req, res) {
  // TODO: [피드백] exception-handler.js 미들웨어를 통해 전역으로 예외를 catch하고 있으므로,
  //       try-catch로 감쌀 필요 없음
  try {
    const userId = req.user.id;
    const battleId = req.params.battleId;

    const createBattleDetailDTO = CreateBattleDetailDTO.fromPlainObject(
      req.body
    );
    createBattleDetailDTO.validate();

    // TODO: [피드백] 해당 배틀에 참가한 사용자인지 확인 필요

    const newBattleDetail = await battleDetailService.createBattleDetail(
      createBattleDetailDTO
    );
    response(res, StatusCodes.CREATED, '생성 성공', newBattleDetail);
  } catch (error) {
    if (error instanceof BizError) {
      response(res, StatusCodes.BAD_REQUEST, error.message);
    } else {
      response(res, StatusCodes.INTERNAL_SERVER_ERROR, '서버 오류');
    }
  }
}

// 배틀 상세 목록 조회
router.get('/', getBattleDetailList);
async function getBattleDetailList(req, res) {
  // TODO: [피드백] exception-handler.js 미들웨어를 통해 전역으로 예외를 catch하고 있으므로,
  //       try-catch로 감쌀 필요 없음
  try {
    const battleId = req.params.battleId;

    // 쿼리 파라미터를 사용해 필터링 옵션을 설정
    const { userId, statusType, detoxTime } = req.query;
    const filter = {
      battleId
    };

    // 필터 조건이 존재하면 추가
    if (userId) filter.userId = userId;
    if (statusType) filter.statusType = statusType;
    if (detoxTime) filter.detoxTime = detoxTime;

    // TODO: [피드백] 해당 배틀에 참가한 사용자인지 확인 필요

    const battleDetailList = await battleDetailService.getBattleDetailList(
      battleId
    );
    response(res, StatusCodes.OK, '조회 성공', battleDetailList);
  } catch (error) {
    response(res, StatusCodes.INTERNAL_SERVER_ERROR, '서버 오류');
  }
}

// 배틀 상세 조회
router.get('/:battleDetailId(\\d+)', getBattleDetail);
async function getBattleDetail(req, res) {
  // TODO: [피드백] exception-handler.js 미들웨어를 통해 전역으로 예외를 catch하고 있으므로,
  //       try-catch로 감쌀 필요 없음
  try {
    const battleDetailId = req.params.battleDetailId;

    // TODO: [피드백] 해당 배틀에 참가한 사용자인지 확인 필요

    const battleDetail = await battleDetailService.getBattleDetail(
      battleDetailId
    );

    if (!battleDetail) {
      // TODO: [피드백] 에러를 throw하면 미들웨어가 이를 캐치하여 처리하므로, 직접 response를 호출할 필요 없음
      return response(
        res,
        StatusCodes.NOT_FOUND,
        '대결 상세를 찾을 수 없습니다.'
      );
    }
    response(res, StatusCodes.OK, '조회 성공', battleDetail);
  } catch (error) {
    response(res, StatusCodes.INTERNAL_SERVER_ERROR, '서버 오류');
  }
}

// 배틀 상세 수정
router.patch('/:detailId(\\d+)', updateBattleDetail);
async function updateBattleDetail(req, res) {
  // TODO: [피드백] exception-handler.js 미들웨어를 통해 전역으로 예외를 catch하고 있으므로,
  //       try-catch로 감쌀 필요 없음
  try {
    const battleDetailId = req.params.detailId;

    const battleDetail = await battleDetailService.getBattleDetail(
      battleDetailId
    );
    if (!battleDetail) {
      // TODO: [피드백] 에러를 throw하면 미들웨어가 이를 캐치하여 처리하므로, 직접 response를 호출할 필요 없음
      return response(
        res,
        StatusCodes.NOT_FOUND,
        '대결 상세를 찾을 수 없습니다.'
      );
    }

    // TODO: [피드백] 검증 후 조회하면 데이터베이스 리소스 조회를 줄일 수 있음
    // DTO 생성 및 검증 (수정 시에는 필요한 필드만 검증)
    const updateData = { ...req.body };

    // TODO: [피드백] updateBattleDetailDTO를 추가하여 사용해야 함
    //       업데이트 로직은 생성 로직과 다를 수 있으므로..
    const createBattleDetailDTO =
      CreateBattleDetailDTO.fromPlainObject(updateData);
    createBattleDetailDTO.validate();

    const updatedBattleDetail = await battleDetailService.updateBattleDetail(
      battleDetailId,
      updateData
    );
    response(res, StatusCodes.OK, '수정 성공', updatedBattleDetail);
  } catch (error) {
    if (error instanceof BizError) {
      response(res, StatusCodes.BAD_REQUEST, error.message);
    } else {
      response(res, StatusCodes.INTERNAL_SERVER_ERROR, '서버 오류');
    }
  }
}

module.exports = router;
