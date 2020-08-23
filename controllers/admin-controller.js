import Category from '../models/category-schema';

const AdminController = {
  viewDashboard(req, res) {
    res.render('pages/admin/dashboard', {
      title: 'Staycation | Dashboard',
    });
  },

  async viewCategory(req, res) {
    try {
      const category = await Category.find();
      const alertMessage = req.flash('alertMessage');
      const alertStatus = req.flash('alertStatus');
      const alert = { message: alertMessage, status: alertStatus };
      res.render('pages/admin/category', {
        category,
        alert,
        title: 'Staycation | Category',
      });
    } catch (error) {
      res.render('pages/admin/category');
    }
  },

  async addCategory(req, res) {
    try {
      const { name } = req.body;
      await Category.create({ name });
      req.flash('alertMessage', 'Success add category');
      req.flash('alertStatus', 'success');
      res.redirect('/admin/category');
    } catch (error) {
      req.flash('alertMessage', '$error.message');
      req.flash('alertStatus', 'danger');
      res.redirect('/admin/category');
    }
  },

  async editCategory(req, res) {
    try {
      const { id, name } = req.body;
      const category = await Category.findOne({ _id: id });
      category.name = name;
      await category.save();
      req.flash('alertMessage', 'Success update category');
      req.flash('alertStatus', 'success');
      res.redirect('/admin/category');
    } catch (error) {
      req.flash('alertMessage', '$error.message');
      req.flash('alertStatus', 'danger');
      res.redirect('/admin/category');
    }
  },

  async deleteCategory(req, res) {
    try {
      const { id } = req.params;
      const category = await Category.findOne({ _id: id });
      await category.remove();
      req.flash('alertMessage', 'Success delete category');
      req.flash('alertStatus', 'success');
      res.redirect('/admin/category');
    } catch (error) {
      req.flash('alertMessage', '$error.message');
      req.flash('alertStatus', 'danger');
      res.redirect('/admin/category');
    }
  },

  viewBank(req, res) {
    res.render('pages/admin/bank', {
      title: 'Staycation | Bank',
    });
  },

  viewItem(req, res) {
    res.render('pages/admin/item', {
      title: 'Staycation | Item',
    });
  },

  viewBooking(req, res) {
    res.render('pages/admin/booking', {
      title: 'Staycation | Booking',
    });
  },
};

export default AdminController;
