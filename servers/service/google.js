

const { OAuth2Client } = require('google-auth-library');
const google_config = require('../config/google.json').web;
const jwt = require('jsonwebtoken');
const jwt_config = require('../config/jwt_config.json');
const mariadb = require('../models/mariadb');





const oAuth2Client = new OAuth2Client(
    google_config.client_id,
    google_config.client_secret,
    google_config.redirect_uris[0]
);



exports.get_url = function () {
    const scopes = [
        "https://www.googleapis.com/auth/userinfo.email",
        "https://www.googleapis.com/auth/userinfo.profile"
    ];
    const url = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: scopes
    });
    return url;
};






function if_user_not_exist(user) {
    if (user == null) return true;
    return false;
}



function make_auth_token(payload) {
    const token = jwt.sign(
        payload,
        jwt_config.secret,
        {
            expiresIn: '1m'
        }
    );
    return token;
}


exports.verify_auth_token = async function (token) {
    return new Promise((resolve, reject) => {
        jwt.verify(token, jwt_config.secret, (err, decoded) => {
            if (err) reject(err);
            resolve(decoded);
        });
    });
};





exports.google_login = async function (code) {
    const r = await oAuth2Client.getToken(code);
    oAuth2Client.setCredentials(r.tokens);

    const tokenInfo = await oAuth2Client.getTokenInfo(
        oAuth2Client.credentials.access_token
    );
    
    let user = await mariadb.find_by_emailAddress(tokenInfo.email);
    if (if_user_not_exist(user)) {
        const newUserData = {
            id: tokenInfo.sub,
            emailAddress: tokenInfo.email,
            password: null,
        };
        const r = await mariadb.create_user(newUserData);
        user = newUserData;
    }
    const payload = {
        id: user.id,
        scope: [],
    };
    const authToken = make_auth_token(payload);

    return authToken;
};







// ==================================================
