

const router = require('express').Router();
const google = require('../oauth2/google');


router.get('/google', function (req, res) {
    const url = google.get_url();
    res.json({ "url": url });
});

router.get('/auth/google/callback', async function (req, res) {
    const authToken = await google.google_login(req.query.code);


    res.cookie('access_token', authToken, {
        sameSite: 'lax',
        secure: false,
        httpOnly: true,
        maxAge: 60 * 1000,

    });

    res.redirect("http://localhost:3000");
});



module.exports = router;