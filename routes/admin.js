/* eslint-disable comma-dangle */
const { Router } = require('express');
const AdminController = require('../controllers/admin-controller');
const { upload, uploadMultiple } = require('../middlewares/multer');
const isLogin = require('../middlewares/auth');

const router = Router();

router.get('/signin', AdminController.viewSignIn);
router.post('/signin', AdminController.signIn);
router.use(isLogin);
router.get('/signout', AdminController.signOut);
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
router.delete('/item/:id', AdminController.deleteItem);

// endpoint detail item
router.get('/item/detail/:itemId', AdminController.viewDetailItem);
// feature
router.post('/item/detail/add/feature', upload, AdminController.addFeature);
router.put('/item/detail/edit/feature', upload, AdminController.editFeature);
router.delete('/item/detail/delete/feature/:id', AdminController.deleteFeature);
// activity
router.post('/item/detail/add/activity', upload, AdminController.addActivity);
router.put('/item/detail/edit/activity', upload, AdminController.editActivity);
router.delete(
  '/item/detail/delete/activity/:id',
  AdminController.deleteActivity
);

// endpoint booking
router.get('/booking', AdminController.viewBooking);
router.get('/booking/:id', AdminController.showDetailBooking);
router.post('/booking/:id', AdminController.confirmBooking);

module.exports = router;
