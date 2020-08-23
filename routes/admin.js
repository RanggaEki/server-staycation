import { Router } from 'express';
import AdminController from '../controllers/admin-controller';

const router = Router();

router.get('/dashboard', AdminController.viewDashboard);
router.get('/category', AdminController.viewCategory);
router.get('/bank', AdminController.viewBank);
router.get('/item', AdminController.viewItem);
router.get('/booking', AdminController.viewBooking);

module.exports = router;
