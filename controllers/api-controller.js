/* eslint-disable consistent-return */
/* eslint-disable operator-linebreak */
/* eslint-disable comma-dangle */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-await-in-loop */
const Activity = require('../models/activity-schema');
const Booking = require('../models/booking-schema');
const Category = require('../models/category-schema');
const Member = require('../models/member-schema');
const Item = require('../models/item-schema');

const ApiController = {
  async landingPage(req, res) {
    try {
      const travelers = (await Booking.find()).length;
      const treasures = (await Activity.find()).length;
      const cities = (await Item.find()).length;

      const mostPicked = await Item.find()
        .select('_id title country city price unit')
        .populate({ path: 'imageId', select: 'imageUrl', perDocumentLimit: 1 })
        .limit(5);

      const categories = await Category.find()
        .select('_id name')
        .limit(3)
        .populate({
          path: 'itemId',
          select: '_id title country city isPopular sumBooking',
          perDocumentLimit: 4,
          options: { sort: '-sumBooking' },
          populate: {
            path: 'imageId',
            select: 'imageUrl',
            perDocumentLimit: 1,
          },
        });

      for (const category of categories) {
        let itemIndex = 0;
        for (const categoryItem of category.itemId) {
          const item = await Item.findOne({ _id: categoryItem._id });
          item.isPopular = itemIndex === 0;
          await item.save();
          itemIndex += 1;
        }
      }

      const testimonial = {
        _id: 'asd1293uasdads1',
        imageUrl: '/images/testimonial.jpg',
        name: 'Happy Family',
        rate: 4.55,
        content:
          'What a great trip with my family and I should try again next time soon ...',
        familyName: 'Angga',
        familyOccupation: 'Product Designer',
      };

      res.status(200).json({
        hero: {
          travelers,
          treasures,
          cities,
        },
        mostPicked,
        categories,
        testimonial,
      });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  async detailPage(req, res) {
    try {
      const { id } = req.params;

      const item = await Item.findOne({ _id: id })
        .populate({
          path: 'imageId',
          select: 'imageUrl',
          perDocumentLimit: 3,
        })
        .populate({ path: 'featureId', select: 'name quantity imageUrl' })
        .populate({
          path: 'activityId',
          select: 'name type imageUrl isPopular',
          perDocumentLimit: 4,
        });

      const testimonial = {
        _id: 'asd1293uasdads1',
        imageUrl: '/images/testimonial-detailspage.jpg',
        name: 'Happy Family',
        rate: 4.25,
        content:
          'What a great trip with my family and I should try again next time soon ...',
        familyName: 'Angga',
        familyOccupation: 'UI Designer',
      };

      res.status(200).json({ item, testimonial });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  async bookingPage(req, res) {
    const {
      idItem,
      duration,
      startDate,
      endDate,
      firstName,
      lastName,
      email,
      phoneNumber,
      accountHolder,
      bankFrom,
    } = req.body;

    if (!req.file) {
      return res.status(404).json({ message: 'Image not found' });
    }

    if (
      idItem === undefined ||
      duration === undefined ||
      startDate === undefined ||
      endDate === undefined ||
      firstName === undefined ||
      lastName === undefined ||
      email === undefined ||
      phoneNumber === undefined ||
      accountHolder === undefined ||
      bankFrom === undefined
    ) {
      res.status(404).json({ message: 'Please complete all field' });
    }

    const item = await Item.findOne({ _id: idItem });

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    item.sumBooking += 1;
    await item.save();
    const { _id, title, price } = item;

    const TAX = 0.1;
    const subTotal = price * duration;
    const taxAmount = subTotal * TAX;
    const total = subTotal + taxAmount;

    const invoice = Math.floor(1000000 + Math.random() * 9000000);

    const member = await Member.create({
      firstName,
      lastName,
      email,
      phoneNumber,
    });

    const newBooking = {
      startDate,
      endDate,
      invoice,
      itemId: {
        _id,
        title,
        price,
        duration,
      },
      total,
      memberId: member._id,
      payments: {
        proofPayment: `images/${req.file.filename}`,
        bankFrom,
        accountHolder,
      },
    };
    const booking = await Booking.create(newBooking);

    res.status(201).json({ message: 'Booking Success', booking });
  },
};

module.exports = ApiController;
