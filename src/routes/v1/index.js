const express = require('express');
const { healthCheckAPIResponse } = require('../../helpers');
const { VerifyToken } = require('../../middlewares');
const router = express.Router();

/**
 * Public APIs
 */
router.get('/', (req, res) => healthCheckAPIResponse(res));
router.get('/health-check', (req, res) => healthCheckAPIResponse(res));
router.use('/auth', require('./auth'));
// router.use(VerifyToken);

router.get('/health-check-protected', (req, res) =>
  healthCheckAPIResponse(res),
);

module.exports = router;
