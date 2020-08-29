/* eslint-disable import/named */
import { Router } from 'express';
import AdminController from '../controllers/admin-controller';
import { uploadMultiple, upload } from '../middlewares/multer';

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

// endpoint item
router.get('/item', AdminController.viewItem);
router.post('/item', uploadMultiple, AdminController.addItem);
router.get('/item/show-image/:id', AdminController.showImageItem);
router.get('/item/:id', AdminController.showEditItem);
router.put('/item/:id', uploadMultiple, AdminController.editItem);
router.delete('/item/:id/delete', AdminController.deleteItem);

// endpoint booking
router.get('/booking', AdminController.viewBooking);

export default router;
