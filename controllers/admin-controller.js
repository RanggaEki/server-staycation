/* eslint-disable no-undef */
import fs from 'fs-extra';
import path from 'path';
import Category from '../models/category-schema';
import Bank from '../models/bank-schema';

const generateSuccessMessage = (req, res, endpoint, model) => {
  const message = `Success ${endpoint} ${model}`;
  req.flash('alertMessage', message);
  req.flash('alertStatus', 'success');
  res.redirect(`/admin/${model}`);
};

const generateErrorMessage = (req, res, error, model) => {
  req.flash('alertMessage', `${error.message}`);
  req.flash('alertStatus', 'danger');
  res.redirect(`/admin/${model}`);
};

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
      generateErrorMessage(req, res, error, 'category');
    }
  },

  async addCategory(req, res) {
    try {
      const { name } = req.body;
      await Category.create({ name });
      generateSuccessMessage(req, res, 'add', 'category');
    } catch (error) {
      generateErrorMessage(req, res, error, 'category');
    }
  },

  async editCategory(req, res) {
    try {
      const { id, name } = req.body;
      const category = await Category.findOne({ _id: id });
      category.name = name;
      await category.save();
      generateSuccessMessage(req, res, 'update', 'category');
    } catch (error) {
      generateErrorMessage(req, res, error, 'category');
    }
  },

  async deleteCategory(req, res) {
    try {
      const { id } = req.params;
      const category = await Category.findOne({ _id: id });
      await category.remove();
      generateSuccessMessage(req, res, 'delete', 'category');
    } catch (error) {
      generateErrorMessage(req, res, error, 'category');
    }
  },

  async viewBank(req, res) {
    try {
      const bank = await Bank.find();
      const alertMessage = req.flash('alertMessage');
      const alertStatus = req.flash('alertStatus');
      const alert = { message: alertMessage, status: alertStatus };
      res.render('pages/admin/bank', {
        title: 'Staycation | Bank',
        alert,
        bank,
      });
    } catch (error) {
      generateErrorMessage(req, res, error, 'bank');
    }
  },

  async addBank(req, res) {
    try {
      const {
        bankName, accountNumber, name,
      } = req.body;
      console.log(req.body);
      await Bank.create({
        bankName,
        accountNumber,
        name,
        imageUrl: `images/${req.file.filename}`,
      });
      generateSuccessMessage(req, res, 'add', 'bank');
    } catch (error) {
      generateErrorMessage(req, res, error, 'bank');
    }
  },

  async editBank(req, res) {
    try {
      const {
        id, bankName, accountNumber, name,
      } = req.body;
      const bank = await Bank.findOne({ _id: id });
      bank.bankName = bankName;
      bank.accountNumber = accountNumber;
      bank.name = name;
      if (req.file !== undefined) {
        await fs.unlink(path.join(`public/${bank.imageUrl}`));
        bank.imageUrl = `images/${req.file.filename}`;
      }
      await bank.save();
      generateSuccessMessage(req, res, 'update', 'bank');
    } catch (error) {
      generateErrorMessage(req, res, error, 'bank');
    }
  },

  async deleteBank(req, res) {
    try {
      const { id } = req.params;
      const bank = await Bank.findOne({ _id: id });
      await fs.unlink(path.join(`public/${bank.imageUrl}`));
      await bank.remove();
      generateSuccessMessage(req, res, 'delete', 'bank');
    } catch (error) {
      generateErrorMessage(req, res, error, 'bank');
    }
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
