const router = require('express').Router();
const auth = require('../oauth2/google');


router.get('/', async function(req, res, next) {
    const authToken = req.cookies['access_token'];
    console.log(authToken);
    try {
        const decoded = await auth.verify_auth_token(authToken);
        next();
    }
    catch (err) {
        console.log(err);
        res.send('unauthorized');
    }
});

router.get('/', (req, res) => {
    res.send('good');
});





module.exports = router;