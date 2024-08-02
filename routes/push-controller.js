/**
 * push-controller.js
 *  푸쉬 관련 컨트롤러
 */
const router = require('express').Router();
const { StatusCodes } = require('http-status-codes');

const userService = require('@/services/user-service');
const response = require('@/common/response');

// TODO: 푸쉬 알림 생성
router.post('/pushes', createPush);

// TODO: 푸쉬 알림 내역 생성
router.post('/pushes/:id/histories', createPushHistory);

module.exports = router;
