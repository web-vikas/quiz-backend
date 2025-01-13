const express = require('express');
const {Auth} = require('../../controllers');

const router = express.Router();

router.post('/login', Auth.loginUser);
router.post('/sign-up', Auth.registerUser);

module.exports = router;
