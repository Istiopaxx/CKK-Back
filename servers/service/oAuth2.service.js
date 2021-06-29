const mariadb = require('../models/mariadb');
const axios = require('axios');
const { OAuth2Client } = require('google-auth-library');
const google_config = require('../config/google.json').web;
const github_config = require('../config/github.json').web;
const { generateToken } = require('./token.service');
const { token } = require('morgan');


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




const getUrls = () => {
  const urls = {
    "google": google.url(),
    "github": github.url(),
  };
  return urls;
};


module.exports = {
  google,
  github,
  getUrls,
};
