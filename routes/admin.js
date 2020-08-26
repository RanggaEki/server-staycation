/* eslint-disable import/named */
import { Router } from 'express';
import AdminController from '../controllers/admin-controller';
import { upload } from '../middlewares/multer';

const router = Router();

router.get('/dashboard', AdminController.viewDashboard);

// endpoint category
router.get('/category', AdminController.viewCategory);
router.post('/category', AdminController.addCategory);
router.put('/category', AdminController.editCategory);
router.delete('/category/:id', AdminController.deleteCategory);

// endpoint category
router.get('/bank', AdminController.viewBank);
router.post('/bank', upload, AdminController.addBank);
router.put('/bank', upload, AdminController.editBank);
router.delete('/bank/:id', AdminController.deleteBank);

router.get('/item', AdminController.viewItem);
router.get('/booking', AdminController.viewBooking);

export default router;
