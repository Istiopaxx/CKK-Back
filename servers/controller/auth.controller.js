const { tokenService, oAuth2Service } = require('../service');

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


const googleLogin = async (req, res) => {
  const token = await oAuth2Service.googleLogin(req.query.code);
  setCookie(res, token);
  res.redirect("http://localhost:3000");
};



const githubLogin = async (req, res) => {
  console.log(req.query.code);
  const token = await oAuth2Service.githubLogin(req.query.code);
  setCookie(res, token);
  res.redirect('http://localhost:3000');
};


  
module.exports = {
  getOAuth2Urls,
  googleLogin,
  githubLogin,
};
