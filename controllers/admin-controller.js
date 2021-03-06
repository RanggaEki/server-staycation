/* eslint-disable object-curly-newline */
/* eslint-disable comma-dangle */
/* eslint-disable max-len */
/* eslint-disable no-shadow */
/* eslint-disable no-plusplus */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-undef */
const fs = require('fs-extra');
const path = require('path');
const bcrypt = require('bcryptjs');
const Category = require('../models/category-schema');
const Bank = require('../models/bank-schema');
const Item = require('../models/item-schema');
const Image = require('../models/image-schema');
const Feature = require('../models/feature-schema');
const Activity = require('../models/activity-schema');
const Users = require('../models/users-schema');
const Booking = require('../models/booking-schema');
const Member = require('../models/member-schema');

const generateSuccessMessage = (req, res, endpoint, model, param = '') => {
  const message = `Success ${endpoint} ${model}`;
  req.flash('alertMessage', message);
  req.flash('alertStatus', 'success');
  const route = param === '' ? model : param;
  res.redirect(`/admin/${route}`);
};

const generateErrorMessage = (req, res, errorMessage, model) => {
  req.flash('alertMessage', errorMessage);
  req.flash('alertStatus', 'danger');
  res.redirect(`/admin/${model}`);
};

const setAlert = (req) => ({
  message: req.flash('alertMessage'),
  status: req.flash('alertStatus'),
});

const AdminController = {
  async viewSignIn(req, res) {
    try {
      const alert = setAlert(req);
      const userSession = req.session.user;
      if (userSession) {
        res.redirect('/admin/dashboard');
      }
      res.render('index', {
        title: 'Staycation | Sign In',
        alert,
      });
    } catch (error) {
      generateErrorMessage(req, res, error.message, '/admin/signin');
    }
  },

  async signIn(req, res) {
    try {
      const { username, password } = req.body;
      const user = await Users.findOne({ username });
      if (!user) {
        generateErrorMessage(req, res, 'user not found', 'signin');
      }
      const isPasswordMatch = await bcrypt.compare(password, user.password);
      if (!isPasswordMatch) {
        generateErrorMessage(req, res, 'wrong password', 'signin');
      }
      req.session.user = {
        id: user._id,
        username: user.username,
      };
      res.redirect('/admin/dashboard');
    } catch (error) {
      generateErrorMessage(req, res, error.message, '/admin/signin');
    }
  },

  signOut(req, res) {
    req.session.destroy();
    res.redirect('/admin/signin');
  },

  async viewDashboard(req, res) {
    try {
      const members = await Member.find();
      const bookings = await Booking.find();
      const items = await Item.find();
      res.render('pages/admin/dashboard', {
        title: 'Staycation | Dashboard',
        user: req.session.user,
        members,
        bookings,
        items,
      });
    } catch (error) {
      generateErrorMessage(req, res, error.message, 'dashboard');
    }
  },

  async viewCategory(req, res) {
    try {
      const category = await Category.find();
      const alert = setAlert(req);
      res.render('pages/admin/category', {
        title: 'Staycation | Category',
        category,
        alert,
        user: req.session.user,
      });
    } catch (error) {
      generateErrorMessage(req, res, error.message, 'category');
    }
  },

  async addCategory(req, res) {
    try {
      const { name } = req.body;
      await Category.create({ name });
      generateSuccessMessage(req, res, 'add', 'category');
    } catch (error) {
      generateErrorMessage(req, res, error.message, 'category');
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
      generateErrorMessage(req, res, error.message, 'category');
    }
  },

  async deleteCategory(req, res) {
    try {
      const { id } = req.params;
      const category = await Category.findOne({ _id: id });
      await category.remove();
      generateSuccessMessage(req, res, 'delete', 'category');
    } catch (error) {
      generateErrorMessage(req, res, error.message, 'category');
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
        user: req.session.user,
      });
    } catch (error) {
      generateErrorMessage(req, res, error.message, 'bank');
    }
  },

  async addBank(req, res) {
    try {
      const { bankName, accountNumber, name } = req.body;
      await Bank.create({
        bankName,
        accountNumber,
        name,
        imageUrl: `images/${req.file.filename}`,
      });
      generateSuccessMessage(req, res, 'add', 'bank');
    } catch (error) {
      generateErrorMessage(req, res, error.message, 'bank');
    }
  },

  async editBank(req, res) {
    try {
      const { id, bankName, accountNumber, name } = req.body;
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
      generateErrorMessage(req, res, error.message, 'bank');
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
      generateErrorMessage(req, res, error.message, 'bank');
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
        user: req.session.user,
      });
    } catch (error) {
      generateErrorMessage(req, res, error.message, 'item');
    }
  },

  async addItem(req, res) {
    try {
      const { title, price, city, categoryId, about } = req.body;
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
          const imageSave = await Image.create({
            imageUrl: `images/${req.files[i].filename}`,
          });
          item.imageId.push({ _id: imageSave._id });
          await item.save();
        }
      }
      generateSuccessMessage(req, res, 'add', 'item');
    } catch (error) {
      generateErrorMessage(req, res, error.message, 'item');
    }
  },

  async showImageItem(req, res) {
    try {
      const { id } = req.params;
      const item = await Item.findOne({ _id: id }).populate({
        path: 'imageId',
        select: 'id imageUrl',
      });
      const alert = setAlert(req);
      res.render('pages/admin/item', {
        title: 'Staycation | Item',
        item,
        alert,
        action: 'show image',
        user: req.session.user,
      });
    } catch (error) {
      generateErrorMessage(req, res, error.message, 'item');
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
        user: req.session.user,
      });
    } catch (error) {
      generateErrorMessage(req, res, error.message, 'item');
    }
  },

  async editItem(req, res) {
    try {
      const { id } = req.params;
      const { title, price, city, categoryId, about } = req.body;
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
      generateErrorMessage(req, res, error.message, 'item');
    }
  },

  async deleteItem(req, res) {
    try {
      const { id } = req.params;
      const item = await Item.findOne({ _id: id }).populate('imageId');
      for (let i = 0; i < item.imageId.length; i++) {
        Image.findOne({ _id: item.imageId[i]._id })
          .then((image) => {
            fs.unlink(path.join(`public/${image.imageUrl}`));
            image.remove();
          })
          .catch((error) => {
            generateErrorMessage(req, res, error.message, 'item');
          });
      }
      await item.remove();
      generateSuccessMessage(req, res, 'delete', 'item');
    } catch (error) {
      generateErrorMessage(req, res, error.message, 'item');
    }
  },

  async viewDetailItem(req, res) {
    const { itemId } = req.params;
    try {
      const alert = setAlert(req);
      const features = await Feature.find({ itemId });
      const activities = await Activity.find({ itemId });
      res.render('pages/admin/item-detail', {
        title: 'Staycation | Detail Item',
        itemId,
        features,
        activities,
        alert,
        user: req.session.user,
      });
    } catch (error) {
      generateErrorMessage(req, res, error.message, `item/detail/${itemId}`);
    }
  },

  async addFeature(req, res) {
    const { name, quantity, itemId } = req.body;
    try {
      const feature = await Feature.create({
        name,
        quantity,
        imageUrl: `images/${req.file.filename}`,
        itemId,
      });
      const item = await Item.findOne({ _id: itemId });
      item.featureId.push({ _id: feature._id });
      await item.save();
      generateSuccessMessage(
        req,
        res,
        'add',
        'feature',
        `item/detail/${itemId}`
      );
    } catch (error) {
      generateErrorMessage(req, res, error.message, `item/detail/${itemId}`);
    }
  },

  async editFeature(req, res) {
    const { id, name, quantity, itemId } = req.body;
    try {
      const feature = await Feature.findOne({ _id: id });
      feature.name = name;
      feature.quantity = quantity;
      if (req.file !== undefined) {
        await fs.unlink(path.join(`public/${feature.imageUrl}`));
        feature.imageUrl = `images/${req.file.filename}`;
      }
      await feature.save();
      generateSuccessMessage(
        req,
        res,
        'update',
        'feature',
        `item/detail/${itemId}`
      );
    } catch (error) {
      generateErrorMessage(req, res, error.message, `item/detail/${itemId}`);
    }
  },

  async deleteFeature(req, res) {
    const { itemId } = req.body;
    try {
      const { id } = req.params;
      const feature = await Feature.findOne({ _id: id });
      const item = await Item.findOne({ _id: itemId });
      const filteredFeature = item.featureId.filter(
        (id) => id.toString() !== feature._id.toString()
      );
      item.featureId = filteredFeature;
      await item.save();
      await fs.unlink(path.join(`public/${feature.imageUrl}`));
      await feature.remove();
      generateSuccessMessage(
        req,
        res,
        'delete',
        'feature',
        `item/detail/${itemId}`
      );
    } catch (error) {
      generateErrorMessage(req, res, error.message, `item/detail/${itemId}`);
    }
  },

  async addActivity(req, res) {
    const { name, type, itemId } = req.body;
    try {
      const activity = await Activity.create({
        name,
        type,
        imageUrl: `images/${req.file.filename}`,
        itemId,
      });
      const item = await Item.findOne({ _id: itemId });
      item.activityId.push({ _id: activity._id });
      await item.save();
      generateSuccessMessage(
        req,
        res,
        'add',
        'activity',
        `item/detail/${itemId}`
      );
    } catch (error) {
      generateErrorMessage(req, res, error.message, `item/detail/${itemId}`);
    }
  },

  async editActivity(req, res) {
    const { id, name, type, itemId } = req.body;
    try {
      const activity = await Activity.findOne({ _id: id });
      activity.name = name;
      activity.type = type;
      if (req.file !== undefined) {
        await fs.unlink(path.join(`public/${activity.imageUrl}`));
        activity.imageUrl = `images/${req.file.filename}`;
      }
      await activity.save();
      generateSuccessMessage(
        req,
        res,
        'update',
        'activity',
        `item/detail/${itemId}`
      );
    } catch (error) {
      generateErrorMessage(req, res, error.message, `item/detail/${itemId}`);
    }
  },

  async deleteActivity(req, res) {
    const { itemId } = req.body;
    try {
      const { id } = req.params;
      const activity = await Activity.findOne({ _id: id });
      const item = await Item.findOne({ _id: itemId });
      const filteredActivity = item.activityId.filter(
        (id) => id.toString() !== activity._id.toString()
      );
      item.activityId = filteredActivity;
      await item.save();
      await fs.unlink(path.join(`public/${activity.imageUrl}`));
      await activity.remove();
      generateSuccessMessage(
        req,
        res,
        'delete',
        'activity',
        `item/detail/${itemId}`
      );
    } catch (error) {
      generateErrorMessage(req, res, error.message, `item/detail/${itemId}`);
    }
  },

  async viewBooking(req, res) {
    try {
      const bookings = await Booking.find()
        .populate('memberId')
        .populate('bankId');
      const alert = setAlert(req);
      res.render('pages/admin/booking', {
        title: 'Staycation | Booking',
        bookings,
        user: req.session.user,
        alert,
      });
    } catch (error) {
      generateErrorMessage(req, res, error.message, 'booking');
    }
  },

  async showDetailBooking(req, res) {
    const { id } = req.params;
    try {
      const booking = await Booking.findOne({ _id: id })
        .populate('memberId')
        .populate('bankId');
      res.render('pages/admin/booking-detail', {
        title: 'Staycation | Booking Detail',
        booking,
        user: req.session.user,
      });
    } catch (error) {
      generateErrorMessage(req, res, error.message, 'booking');
    }
  },

  async confirmBooking(req, res) {
    const { id } = req.params;
    try {
      const { confirmation } = req.body;
      const booking = await Booking.findOne({ _id: id });
      booking.payments.status = confirmation;
      await booking.save();
      generateSuccessMessage(req, res, confirmation, 'booking');
    } catch (error) {
      generateErrorMessage(req, res, error.message, `admin/booking/${id}`);
    }
  },
};

module.exports = AdminController;
