const mariadb = require('../models/mariadb');
const axios = require('axios');
const { OAuth2Client } = require('google-auth-library');
const { generateToken } = require('./token.service');

const google_config = require('../config/google.json').web;
const github_config = require('../config/github.json').web;
const kakao_config = require('../config/kakao.json').web;


const googleClient = new OAuth2Client(
  google_config.client_id,
  google_config.client_secret,
  google_config.redirect_uris[0]
);


const google = {
  Login: async (code) => {
    const r = await googleClient.getToken(code);
    googleClient.setCredentials(r.tokens);
    const tokenInfo = await googleClient.getTokenInfo(
      googleClient.credentials.access_token
    );
    
    let user = await mariadb.find_by_emailAddress(tokenInfo.email);
    if (!user) {
      // user register, later implement
    }
    return generateToken(user.id, '10m', user.roles);
  },

  
  url: () => {
    const scopes = [
      "https://www.googleapis.com/auth/userinfo.email",
      "https://www.googleapis.com/auth/userinfo.profile"
    ];
    const url = googleClient.generateAuthUrl({
      access_type: 'offline',
      scope: scopes
    });
    return url;
  },
};



const github = {
  Login: async (code) => {
    const res = await axios({
      method: 'post',
      url: `https://github.com/login/oauth/access_token?client_id=${github_config.client_id}&client_secret=${github_config.client_secret}&code=${code}`,
      headers: {
        accept: 'application/json'
      }
    });
    const access_token = res.data.access_token;
    const getInfo = await axios({
      method: "get",
      url: "https://api.github.com/user",
      headers: {
        Authorization: 'token ' + access_token
      }
    });
    console.log(getInfo.data);
    // get userinfo - email addr, etc.
    // user register and generate token



    return "token";
  },


  url: () => {
    let url = `https://github.com/login/oauth/authorize?client_id=${github_config.client_id}&scope=user`;
    return url;
  },
};


const kakao = {
  Login: async (code) => {
    const res = await axios({
      method: 'post',
      url: `https://kauth.kakao.com/oauth/token`,
      headers: {
        "Content-Type": 'application/json'
      },
      data: {
        "grant_type": "authorization_code",
        "client_id": kakao_config.client_id,
        "redirect_uri": kakao_config.redirect_uri,
        "code": code
      }
    });
    const token = res.data.access_token;
    const getInfo = await axios({
      method: 'post',
      url: 'https://kapi.kakao.com/v2/user/me',
      headers: {
        Authorization: 'Bearer ' + token,
        "Content-type": "application/json"
      },
      data: {
        'property_keys': ["kakao_account.email"]
      }
    });
    const email = getInfo.data.kakao_account.email;

    let user = await mariadb.find_by_emailAddress(email);
    if (!user) {
      // user register, later implement
    }
    return generateToken(user.id, '10m', user.roles);

  },

  url: () => {
    let url = `https://kauth.kakao.com/oauth/authorize?client_id=${kakao_config.client_id}&redirect_uri=${kakao_config.redirect_uri}&response_type=code`;
    return url;
  },


};





const getUrls = () => {
  const urls = {
    "google": google.url(),
    "github": github.url(),
    "kakao": kakao.url(),
  };
  return urls;
};


module.exports = {
  google,
  github,
  kakao,
  getUrls,
};
