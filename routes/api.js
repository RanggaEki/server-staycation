/* eslint-disable import/named */
const { Router } = require('express');
const ApiController = require('../controllers/api-controller');
const { upload } = require('../middlewares/multer');

const router = Router();

router.get('/landing-page', ApiController.landingPage);
router.get('/detail-page/:id', ApiController.detailPage);
router.post('/booking-page', upload, ApiController.bookingPage);

module.exports = router;
