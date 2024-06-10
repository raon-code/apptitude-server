/**
 * kakao/auth.js
 *  카카오 인증 API
 */
const axios = require('axios');
const kakaoConfig = require('@/config').kakao;

// 인가코드 URL
function getAuthUrl() {
  return (
    'https://kauth.kakao.com/oauth/authorize?response_type=code' +
    `&client_id=${kakaoConfig.restApiKey}&redirect_uri=${kakaoConfig.redirectUrl}`
  );
}

/**
 * 토큰발급
 * @param {*} auth
 * @returns
 */
async function getToken(auth) {
  const params = new URLSearchParams();
  params.append('grant_type', 'authorization_code');
  params.append('client_id', kakaoConfig.restApiKey);
  params.append('redirect_uri', kakaoConfig.redirectUrl);
  params.append('code', auth);

  const response = await axios.post(
    'https://kauth.kakao.com/oauth/token',
    params.toString(),
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }
  );

  return response;
}

/**
 * 토큰정보 조회
 * @param {*} accessToken
 * @returns
 */
async function getTokenInfo(accessToken) {
  const response = await axios.get(
    'https://kapi.kakao.com/v1/user/access_token_info',
    {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }
  );

  return response;
}

/**
 * 유저정보 조회
 * @param {*} token
 * @returns
 */
async function getUserInfo(token) {
  const response = await axios.get('https://kapi.kakao.com/v2/user/me', {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });

  return response;
}

module.exports = {
  getAuthUrl,
  getToken,
  getTokenInfo,
  getUserInfo
};
