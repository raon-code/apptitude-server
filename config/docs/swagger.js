const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const config = require('@/config'); // config/index

let _url = 'http://localhost';
switch (config.nodeEnv) {
  case 'dev': // 개발환경
    _url = 'http://apptitude-elb-1043931769.ap-northeast-2.elb.amazonaws.com';
    break;

  case 'prod': // 운영환경
    _url = 'https://buddy-battle.com';
    break;

  default: // 로컬환경
    _url = 'http://localhost:3000';
    break;
}

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
        url: 'https://buddy-battle.com',
        email: 'aptitude0616@gmail.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000' // 요청 URL
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
