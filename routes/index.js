const express = require('express');
const router = express.Router();
const homeController = require('../controllers/homeController');
const dashboardController = require('../controllers/dashboardController');

router.get('/', homeController.index);
router.get('/dashboard', dashboardController.index);

module.exports = router;
