const router = require('express').Router();
const { Post } = require('../models/index');
const validateJWT = require('../middleware/validatejwt');

router.get('/test', (req, res) => {
    res.send('This is a practice route!')
})

module.exports = router;