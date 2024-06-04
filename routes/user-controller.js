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
 *                 type: string
 *                 description: 이메일
 *                 example: sb92120@gmail.com
 *               nickname:
 *                 type: string
 *                 description: 닉네임
 *                 example: NoPainNoLife
 *               gender:
 *                 type: string(enum)
 *                 description: 성별(공통코드)
 *                 example: GD1
 *               ageRange:
 *                 type: string(enum)
 *                 description: 연령대(공통코드)
 *                 example: AR2
 *               jobType:
 *                 type: string(enum)
 *                 description: 직업타입(공통코드)
 *                 example: JT0
 *               jobDetail:
 *                 type: string
 *                 description: 직업상세, 직접입력 선택시 활성화
 *                 example: 만년백수
 *               profilePhotoPath:
 *                 type: string
 *                 description: 프로필사진 경로, 호스트 url은 제외
 *                 example: /path/to/the/profile/photo.jpg
 *               LoginPlatform:
 *                 type: object
 *                 required:
 *                 - platformType
 *                 - uuid
 *                 properties:
 *                   platformType:
 *                     type: string(enum)
 *                     description: 플랫폼 타입(공통코드)
 *                     example: PT0
 *                   uuid:
 *                     type: string
 *                     description: UUID
 *                     example: 1234567890
 *     responses:
 *       201:
 *         description: 사용자를 성공적으로 생성
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
 *                   description: 생성한 사용자 정보
 *               required:
 *                 - statusCode
 *                 - message
 *                 - data
 */
router.post('/', createUser);
async function createUser(req, res) {
  const createUserDTO = CreateUserDTO.fromPlainObject(req.body);
  createUserDTO.validate();

  const newUser = await userService.createUser(createUserDTO);
  response(res, StatusCodes.CREATED, 'Created', newUser);
}

module.exports = router;
