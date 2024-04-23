const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerOption = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Apptitude API 명세',
      version: '0.1.0',
      description: 'Apptitude API 명세입니다.',
      license: {
        name: 'MIT',
        url: 'https://spdx.org/licenses/MIT.html'
      },
      contact: {
        name: 'apptitude',
        url: 'https://apptitude.com',
        email: 'info@apptitude.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000' // 요청 URL
      }
    ]
  },
  apis: ['./routes/*.js'] // 파일 연동
};

const specs = swaggerJsdoc(swaggerOption);

module.exports = {
  swaggerUi,
  specs
};
