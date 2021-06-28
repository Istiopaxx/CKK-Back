const { tokenService, oAuth2Service } = require('../service');



const getOAuth2Urls = (req, res) => {
  const urls = oAuth2Service.getUrls();
  res.json(urls);
};


const googleLogin = async (req, res) => {
  const token = await oAuth2Service.googleLogin(req.query.code);
  res.cookie('user_sess', token, {
    sameSite: 'lax',
    secure: false,
    httpOnly: true,
    maxAge: 10 * 60 * 1000,
  });
  res.redirect("http://localhost:3000");
};
