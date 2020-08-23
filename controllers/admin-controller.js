const AdminController = {
  viewDashboard(req, res) {
    res.render('pages/admin/dashboard');
  },
  viewCategory(req, res) {
    res.render('pages/admin/category');
  },
  viewBank(req, res) {
    res.render('pages/admin/bank');
  },
  viewItem(req, res) {
    res.render('pages/admin/item');
  },
  viewBooking(req, res) {
    res.render('pages/admin/booking');
  },
};

export default AdminController;
