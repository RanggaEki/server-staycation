/* eslint-disable import/named */
import { Router } from 'express';
import ApiController from '../controllers/api-controller';
import { upload } from '../middlewares/multer';

const router = Router();

router.get('/landing-page', ApiController.landingPage);
router.get('/detail-page/:id', ApiController.detailPage);
router.post('/booking-page', upload, ApiController.bookingPage);

export default router;
