const express = require('express');
const router = express.Router();

const auth = require('./auth.js');

// Router delegates to other routers as middleware
router.use('/', auth);

module.exports = router;