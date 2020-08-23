import { Router } from 'express';
import AdminController from '../controllers/admin-controller';

const router = Router();

router.get('/dashboard', AdminController.viewDashboard);
// endpoint category
router.get('/category', AdminController.viewCategory);
router.post('/category', AdminController.addCategory);
router.put('/category', AdminController.editCategory);
router.delete('/category/:id', AdminController.deleteCategory);

router.get('/bank', AdminController.viewBank);
router.get('/item', AdminController.viewItem);
router.get('/booking', AdminController.viewBooking);

module.exports = router;
