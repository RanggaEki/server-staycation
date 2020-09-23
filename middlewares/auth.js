const isLogin = (req, res, next) => {
  const userSession = req.session.user;
  if (userSession === null || userSession === undefined) {
    req.flash('alertMessage', 'Your session is expired, please login again');
    req.flash('alertStatus', 'danger');
    res.redirect('/admin/signin');
  }
  next();
};

module.exports = isLogin;
