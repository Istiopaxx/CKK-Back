

const { OAuth2Client } = require('google-auth-library');
const google_config = require('../config/google.json').web;
const router = require('express').Router();


const oAuth2Client = new OAuth2Client(
    google_config.client_id,
    google_config.client_secret,
    google_config.redirect_uris[0]
);



function getUrl() {
    const scopes = [
        "https://www.googleapis.com/auth/userinfo.email",
        "https://www.googleapis.com/auth/userinfo.profile"
    ];
    const url = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: scopes
    });
    console.log(url);
    return url;
}



async function googleLogin(code) {
    const r = await oAuth2Client.getToken(code);
    oAuth2Client.setCredentials(r.tokens);

    const tokenInfo = await oAuth2Client.getTokenInfo(
        oAuth2Client.credentials.access_token
    );
    console.log(tokenInfo);

    oAuth2Client.on('tokens', (tokens) => {
        if (tokens.refresh_token) {
            console.log("refresh token : ", tokens.refresh_token);
        }
        console.log("access token : ", tokens.access_token);
    });

    return oAuth2Client.credentials.access_token;
}


async function verify(token) {
    try {
        const ticket = await oAuth2Client.verifyIdToken({
            idToken: token,
            audience: google_config.client_id
        });
        const payload = ticket.getPayload();
        return payload;
    }
    catch (err) {
        throw new Error('no valid token');
    }
}













// ==================================================

router.get('/google', function (req, res) {
    const url = getUrl();
    res.json({ "url": url });
});

router.get('/auth/google/callback', async function (req, res) {
    const access_token = await googleLogin(req.query.code);
    console.log("right login : ", access_token);

    res.cookie('access_token', access_token, {
        sameSite: 'lax',
        secure: false,
        httpOnly: true,
    });

    res.redirect("http://localhost:3000");
});



module.exports = router;