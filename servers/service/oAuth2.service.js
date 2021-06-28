
const mariadb = require('../models/mariadb');

const { OAuth2Client } = require('google-auth-library');
const google_config = require('../config/google.json').web;

const { generateToken } = require('./token.service');
const { token } = require('morgan');



const googleClient = new OAuth2Client(
  google_config.client_id,
  google_config.client_secret,
  google_config.redirect_uris[0]
);

const googleUrl = () => {
  const scopes = [
    "https://www.googleapis.com/auth/userinfo.email",
    "https://www.googleapis.com/auth/userinfo.profile"
  ];
  const url = googleClient.generateAuthUrl({
    access_type: 'offline',
    scope: scopes
  });
  return url;
};

const googleLogin = async (code) => {
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
};


const getUrls = () => {
  const urls = {
    "google": googleUrl(),
  };
  return urls;
};


module.exports = {
  googleLogin,
  getUrls,
};
