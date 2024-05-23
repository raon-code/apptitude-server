/**
 * user-controller.js
 *  사용자 컨트롤러
 */
const router = require('express').Router();
const { StatusCodes } = require('http-status-codes');

const userService = require('@/services/user-service');
const response = require('@/common/response');

const CreateUserDTO = require('@/types/dto/create-user-dto');

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: 사용자를 생성
 *     description: 회원입력 정보를 바탕으로 사용자를 생성
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - nickname
 *               - gender
 *               - ageRange
 *               - jobType
 *               - jobDetail
 *               - profilePhotoPath
 *             properties:
 *               email:
 *                 type: <타입>
 *                 description: <설명>
 *                 example: <예>
 *               nickname:
 *                 type: <타입>
 *                 description: <설명>
 *                 example: <예>
 *               gender:
 *                 type: <타입>
 *                 description: <설명>
 *                 example: <예>
 *               ageRange:
 *                 type: <타입>
 *                 description: <설명>
 *                 example: <예>
 *               jobType:
 *                 type: <타입>
 *                 description: <설명>
 *                 example: <예>
 *               jobDetail:
 *                 type: <타입>
 *                 description: <설명>
 *                 example: <예>
 *               profilePhotoPath:
 *                 type: <타입>
 *                 description: <설명>
 *                 example: <예>
 *     responses:
 *       201:
 *         description: <대상>을 성공적으로 생성
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: number
 *                   example: 201
 *                 message:
 *                   type: string
 *                   example: 'Created'
 *                 data:
 *                   type: object
 *                   properties:
 *                     <반환값-1>:
 *                       type: <타입>
 *                       description: <설명>
 *                       example: <예>
 *                     <등등..>:
 *                       type: <타입>
 *                       description: <설명>
 *                       example: <예>
 *               required:
 *                 - statusCode
 *                 - message
 *                 - data
 */
router.post('/', createUser);
async function createUser(req, res) {
  // parse & validation
  const createUserDto = CreateUserDTO.fromPlainObject(req.body);
  createUserDto.validate();

  const newUser = await userService.createUser();
  response(res, StatusCodes.CREATED, 'Created', newUser);
}

module.exports = router;
