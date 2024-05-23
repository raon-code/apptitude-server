/**
 * user-controller.js
 *  사용자 컨트롤러
 */
const router = require('express').Router();
const { StatusCodes } = require('http-status-codes');

const userService = require('@/services/user-service');
const response = require('@/common/response');

router.post('/', createUser);
async function createUser(req, res) {
  const newUser = await userService.createUser();
}

module.exports = router;
