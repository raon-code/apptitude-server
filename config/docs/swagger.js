/**
 * swagger.js
 *  swagger 설정 및 초기화
 */

const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const config = require('@/config'); // config/index

// swagger 요청 base URL 설정

const swaggerOption = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: '버디배틀(Buddy Battle) API 명세',
      version: '0.1.0',
      description: '버디배틀(Buddy Battle) API 명세입니다.',
      license: {
        name: 'MIT',
        url: 'https://spdx.org/licenses/MIT.html'
      },
      contact: {
        name: 'admin',
        url: 'https://www.buddybattle.net',
        email: 'aptitude0616@gmail.com'
      }
    },
    servers: [
      {
        url: config.server.baseUrl // 요청 URL
      }
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter JWT token in the format Bearer {token}'
        }
      }
    },
    security: [
      {
        BearerAuth: []
      }
    ]
  },
  apis: ['./routes/test/*.js', './routes/*.js'] // swagger 연동 대상 파일
};

const specs = swaggerJsdoc(swaggerOption);

module.exports = {
  swaggerUi,
  specs
};
