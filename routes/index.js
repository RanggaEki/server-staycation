const { Router } = require('express');

const router = Router();

/* GET home page. */
router.get('/', (req, res) => {
  res.redirect('/admin/signin');
});

module.exports = router;
