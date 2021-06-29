const { tokenService, oAuth2Service } = require('../service');

const providers = {
  'google': oAuth2Service.google,
  'github': oAuth2Service.github,
};

const setCookie = (res, token) => {
  res.cookie('user_sess', token, {
    sameSite: 'lax',
    secure: false,
    httpOnly: true,
    maxAge: 10 * 60 * 1000,
  });
};


const getOAuth2Urls = (req, res) => {
  const urls = oAuth2Service.getUrls();
  res.json(urls);
};


const oAuthLogin = (provider) => async (req, res) => {
  const token = await providers[provider].Login(req.query.code);
  setCookie(res, token);
  res.redirect("http://localhost:3000");
};



module.exports = {
  getOAuth2Urls,
  oAuthLogin,
};
