const express = require('express');
const router = express.Router();
const redisController = require('../controllers/redisController');

router.post('/set', redisController.setValue);
router.get('/get/:key', redisController.getValue);

module.exports = router;