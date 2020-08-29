/* eslint-disable no-shadow */
/* eslint-disable no-plusplus */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-undef */
import fs from 'fs-extra';
import path from 'path';
import Category from '../models/category-schema';
import Bank from '../models/bank-schema';
import Item from '../models/item-schema';
import Image from '../models/image-schema';

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

const setAlert = (req) => ({
  message: req.flash('alertMessage'),
  status: req.flash('alertStatus'),
});

const AdminController = {
  viewDashboard(req, res) {
    res.render('pages/admin/dashboard', {
      title: 'Staycation | Dashboard',
    });
  },

  async viewCategory(req, res) {
    try {
      const category = await Category.find();
      const alert = setAlert(req);
      res.render('pages/admin/category', {
        title: 'Staycation | Category',
        category,
        alert,
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
      const alert = setAlert(req);
      res.render('pages/admin/bank', {
        title: 'Staycation | Bank',
        bank,
        alert,
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

  async viewItem(req, res) {
    try {
      const item = await Item.find()
        .populate({ path: 'imageId', select: 'id imageUrl' })
        .populate({ path: 'categoryId', select: 'id name' });
      const category = await Category.find();
      const alert = setAlert(req);
      res.render('pages/admin/item', {
        title: 'Staycation | Item',
        item,
        category,
        alert,
        action: 'view',
      });
    } catch (error) {
      generateErrorMessage(req, res, error, 'item');
    }
  },

  async addItem(req, res) {
    try {
      const {
        title, price, city, categoryId, about,
      } = req.body;
      if (req.files.length > 0) {
        const category = await Category.findOne({ _id: categoryId });
        const newItem = {
          title,
          price,
          city,
          categoryId: category._id,
          description: about,
        };
        const item = await Item.create(newItem);
        category.itemId.push({ _id: item._id });
        await category.save();
        for (let i = 0; i < req.files.length; i++) {
          const imageSave = await Image.create({ imageUrl: `images/${req.files[i].filename}` });
          item.imageId.push({ _id: imageSave._id });
          await item.save();
        }
      }
      generateSuccessMessage(req, res, 'add', 'item');
    } catch (error) {
      generateErrorMessage(req, res, error, 'item');
    }
  },

  async showImageItem(req, res) {
    try {
      const { id } = req.params;
      const item = await Item.findOne({ _id: id })
        .populate({ path: 'imageId', select: 'id imageUrl' });
      const alert = setAlert(req);
      res.render('pages/admin/item', {
        title: 'Staycation | Item',
        item,
        alert,
        action: 'show image',
      });
    } catch (error) {
      generateErrorMessage(req, res, error, 'item');
    }
  },

  async showEditItem(req, res) {
    try {
      const { id } = req.params;
      const item = await Item.findOne({ _id: id })
        .populate({ path: 'imageId', select: 'id imageUrl' })
        .populate({ path: 'categoryId', select: 'id name' });
      const category = await Category.find();
      const alert = setAlert(req);
      res.render('pages/admin/item', {
        title: 'Staycation | Item',
        item,
        category,
        alert,
        action: 'edit',
      });
    } catch (error) {
      generateErrorMessage(req, res, error, 'item');
    }
  },

  async editItem(req, res) {
    try {
      const { id } = req.params;
      const {
        title, price, city, categoryId, about,
      } = req.body;
      const item = await Item.findOne({ _id: id })
        .populate({ path: 'imageId', select: 'id imageUrl' })
        .populate({ path: 'categoryId', select: 'id name' });
      if (req.files.length > 0) {
        for (let i = 0; i < item.imageId.length; i++) {
          const imageUpdate = await Image.findOne({ _id: item.imageId[i]._id });
          await fs.unlink(path.join(`public/${imageUpdate.imageUrl}`));
          imageUpdate.imageUrl = `images/${req.files[i].filename}`;
          await imageUpdate.save();
        }
      }
      item.title = title;
      item.price = price;
      item.city = city;
      item.categoryId = categoryId;
      item.description = about;
      await item.save();
      generateSuccessMessage(req, res, 'update', 'item');
    } catch (error) {
      generateErrorMessage(req, res, error, 'item');
    }
  },

  async deleteItem(req, res) {
    try {
      const { id } = req.params;
      const item = await Item.findOne({ _id: id }).populate('imageId');
      for (let i = 0; i < item.imageId.length; i++) {
        Image.findOne({ _id: item.imageId[i]._id }).then((image) => {
          fs.unlink(path.join(`public/${image.imageUrl}`));
          image.remove();
        }).catch((error) => {
          generateErrorMessage(req, res, error, 'item');
        });
      }
      await item.remove();
      generateSuccessMessage(req, res, 'delete', 'item');
    } catch (error) {
      generateErrorMessage(req, res, error, 'item');
    }
  },

  viewBooking(req, res) {
    res.render('pages/admin/booking', {
      title: 'Staycation | Booking',
    });
  },
};

export default AdminController;
